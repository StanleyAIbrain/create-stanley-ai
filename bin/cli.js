#!/usr/bin/env node

/**
 * create-stanley-ai
 * 
 * A cognitive framework for Claude — persistent memory, learning loops,
 * behavioral adaptation, and 49+ skills. Built by a mortgage broker who
 * automated his entire business with AI.
 * 
 * Usage:
 *   npx create-stanley-ai          # Hosted mode (easy, 3 steps)
 *   npx create-stanley-ai --dev    # Developer mode (full local stack)
 *   npx create-stanley-ai doctor   # Health check
 *   npx create-stanley-ai update   # Pull latest skills
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { writeFileSync, mkdirSync, existsSync, readFileSync, copyFileSync, readdirSync, statSync } from 'fs';
import { execSync, exec } from 'child_process';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const HOME = homedir();
const STANLEY_DIR = join(HOME, 'stanley-ai');

// ═══════════════════════════════════════════════════════════════
// COLORS — zero dependency terminal coloring
// ═══════════════════════════════════════════════════════════════
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bg: {
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
  }
};

const log = (msg) => console.log(msg);
const ok = (msg) => log(`  ${c.green}✓${c.reset} ${msg}`);
const warn = (msg) => log(`  ${c.yellow}⚠${c.reset} ${msg}`);
const fail = (msg) => log(`  ${c.red}✗${c.reset} ${msg}`);
const info = (msg) => log(`  ${c.cyan}ℹ${c.reset} ${msg}`);
const step = (n, msg) => log(`\n${c.bold}${c.magenta}[${n}]${c.reset} ${c.bold}${msg}${c.reset}`);
const divider = () => log(`${c.dim}${'─'.repeat(60)}${c.reset}`);

// ═══════════════════════════════════════════════════════════════
// READLINE PROMPTS — interactive Q&A
// ═══════════════════════════════════════════════════════════════
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultVal = '') {
  const suffix = defaultVal ? ` ${c.dim}(${defaultVal})${c.reset}` : '';
  return new Promise(resolve => {
    rl.question(`  ${c.cyan}?${c.reset} ${question}${suffix}: `, answer => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function askChoice(question, options) {
  log(`\n  ${c.cyan}?${c.reset} ${question}`);
  options.forEach((opt, i) => {
    log(`    ${c.dim}${i + 1}.${c.reset} ${opt.label}${opt.desc ? c.dim + ' — ' + opt.desc + c.reset : ''}`);
  });
  return new Promise(resolve => {
    rl.question(`  ${c.cyan}→${c.reset} Pick a number (1-${options.length}): `, answer => {
      const idx = parseInt(answer) - 1;
      resolve(options[Math.max(0, Math.min(idx, options.length - 1))].value);
    });
  });
}

function askMulti(question, options) {
  log(`\n  ${c.cyan}?${c.reset} ${question} ${c.dim}(comma-separated, or 'all')${c.reset}`);
  options.forEach((opt, i) => {
    log(`    ${c.dim}${i + 1}.${c.reset} ${opt.label}${opt.desc ? c.dim + ' — ' + opt.desc + c.reset : ''}`);
  });
  return new Promise(resolve => {
    rl.question(`  ${c.cyan}→${c.reset} Your picks: `, answer => {
      if (answer.toLowerCase() === 'all') {
        resolve(options.map(o => o.value));
      } else {
        const indices = answer.split(',').map(s => parseInt(s.trim()) - 1).filter(i => i >= 0 && i < options.length);
        resolve(indices.map(i => options[i].value));
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// PREREQUISITE CHECKS
// ═══════════════════════════════════════════════════════════════
function checkCommand(cmd, minVersion = null) {
  try {
    const result = execSync(`${cmd} 2>/dev/null || true`, { encoding: 'utf-8' }).trim();
    if (!result) return { ok: false, version: null };
    const version = result.match(/(\d+\.\d+[\.\d]*)/)?.[1] || result;
    if (minVersion) {
      const [major] = version.split('.').map(Number);
      const [minMajor] = minVersion.split('.').map(Number);
      return { ok: major >= minMajor, version };
    }
    return { ok: true, version };
  } catch {
    return { ok: false, version: null };
  }
}

async function runPreflight(isDev) {
  step('0', 'Pre-flight checks');
  divider();

  const checks = [
    { name: 'Node.js', cmd: 'node --version', min: '18', required: true },
    { name: 'Git', cmd: 'git --version', min: null, required: true },
  ];

  if (isDev) {
    checks.push(
      { name: 'Python 3', cmd: 'python3 --version', min: '3.11', required: true },
      { name: 'pip', cmd: 'python3 -m pip --version', min: null, required: true },
      { name: 'Claude Code', cmd: 'claude --version', min: null, required: false },
      { name: 'Wrangler', cmd: 'wrangler --version', min: null, required: false },
      { name: 'cloudflared', cmd: 'cloudflared --version', min: null, required: false },
      { name: 'tmux', cmd: 'tmux -V', min: null, required: false },
    );
  }

  let allGood = true;
  for (const chk of checks) {
    const result = checkCommand(chk.cmd, chk.min);
    if (result.ok) {
      ok(`${chk.name} ${c.dim}${result.version}${c.reset}`);
    } else if (chk.required) {
      fail(`${chk.name} — ${c.red}REQUIRED${c.reset}. ${getInstallHint(chk.name)}`);
      allGood = false;
    } else {
      warn(`${chk.name} — optional, not found. ${getInstallHint(chk.name)}`);
    }
  }

  if (!allGood) {
    log(`\n  ${c.red}${c.bold}Missing required software. Install them and re-run.${c.reset}`);
    process.exit(1);
  }

  ok(`${c.green}All required checks passed${c.reset}`);
  return true;
}

function getInstallHint(name) {
  const hints = {
    'Node.js': 'Install: https://nodejs.org or brew install node',
    'Git': 'Mac: xcode-select --install / Linux: apt install git',
    'Python 3': 'Mac: brew install python@3.13 / Linux: apt install python3.11',
    'pip': 'python3 -m ensurepip --upgrade',
    'Claude Code': 'curl -fsSL https://claude.ai/install.sh | bash',
    'Wrangler': 'npm install -g wrangler && wrangler login',
    'cloudflared': 'Mac: brew install cloudflared',
    'tmux': 'Mac: brew install tmux',
    'Homebrew': '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
  };
  return c.dim + (hints[name] || '') + c.reset;
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING — The 8 Questions
// ═══════════════════════════════════════════════════════════════
async function runOnboarding() {
  step('1', 'Let\'s get to know you');
  divider();
  log(`  ${c.dim}These 8 answers become your AI's DNA. Be specific.${c.reset}`);

  const answers = {};

  answers.name = await ask('Your first name');
  answers.role = await ask('What you do in one sentence', 'entrepreneur building with AI');
  answers.company = await ask('Company/project name (or "personal")', 'personal');
  answers.goal = await ask('Biggest goal right now');

  answers.style = await askChoice('How should Claude talk to you?', [
    { label: 'Sharp CTO', desc: 'direct, no fluff, challenge my ideas', value: 'sharp' },
    { label: 'Thoughtful advisor', desc: 'warm but honest, explains reasoning', value: 'advisor' },
    { label: 'Fast executor', desc: 'minimum talk, maximum action', value: 'executor' },
    { label: 'Patient teacher', desc: 'explain things clearly, be encouraging', value: 'teacher' },
  ]);

  answers.projects = await ask('List your active projects (comma-separated)', 'main project');
  answers.tools = await ask('Tools you already use (comma-separated)', 'none yet');
  answers.firstTask = await ask('First thing you want Claude to help with');

  return answers;
}

// ═══════════════════════════════════════════════════════════════
// SKILL SELECTION
// ═══════════════════════════════════════════════════════════════
async function selectSkills() {
  step('2', 'Choose your skill packs');
  divider();

  const packs = await askMulti('Which skill packs do you want?', [
    { label: '📊 Business & Strategy', desc: 'prompts, brainstorming, invoices, automation', value: 'business' },
    { label: '🔍 Research & Intelligence', desc: 'web scraping, competitor intel, SEO, TikTok', value: 'research' },
    { label: '🎬 Content & Media', desc: 'AI images, video, presentations, writing', value: 'content' },
    { label: '🔒 Dev & Security', desc: 'OWASP, debugging, context engineering', value: 'dev' },
    { label: '⚡ Platform & Infra', desc: 'Google Workspace, voice input, vision', value: 'platform' },
  ]);

  return packs;
}

// ═══════════════════════════════════════════════════════════════
// API KEY COLLECTION (dev mode)
// ═══════════════════════════════════════════════════════════════
async function collectApiKeys() {
  step('2b', 'API Keys (all optional — press Enter to skip)');
  divider();
  log(`  ${c.dim}Each API unlocks skills. All have free tiers. Skip any you don't have.${c.reset}\n`);

  const apis = {};
  const apiList = [
    { key: 'FIRECRAWL_API_KEY', name: 'Firecrawl', desc: 'Web scraping (500 free credits)', signup: 'firecrawl.dev' },
    { key: 'TAVILY_API_KEY', name: 'Tavily', desc: 'Web research (1000 free searches)', signup: 'tavily.com' },
    { key: 'REPLICATE_API_TOKEN', name: 'Replicate', desc: 'AI media generation ($5 free)', signup: 'replicate.com' },
    { key: 'ELEVENLABS_API_KEY', name: 'ElevenLabs', desc: 'Voice cloning (10K chars free)', signup: 'elevenlabs.io' },
  ];

  for (const api of apiList) {
    const val = await ask(`${api.name} ${c.dim}— ${api.desc} (${api.signup})${c.reset}`);
    if (val) apis[api.key] = val;
  }

  return apis;
}

// ═══════════════════════════════════════════════════════════════
// GENERATORS — Produce all config files
// ═══════════════════════════════════════════════════════════════
function generatePreferences(answers) {
  const styleMap = {
    sharp: `Communication rules: Short, punchy, direct. No preamble. No fluff. Never start with "Great question", "I'd be happy to", "Sure!", "Absolutely!", or any filler. Talk to me like a sharp CTO — direct, no hand-holding, no hedging.`,
    advisor: `Communication rules: Be warm but honest. Explain your reasoning. Push back when I'm wrong, but do it constructively. Think of yourself as a thoughtful advisor who genuinely cares about my outcomes.`,
    executor: `Communication rules: Minimum talk, maximum action. Don't explain unless I ask. Execute immediately. When I give a task, do it — don't ask clarifying questions unless truly ambiguous.`,
    teacher: `Communication rules: Be patient and clear. Explain concepts when introducing them. Use analogies. Encourage me when I'm on the right track. Never make me feel dumb for asking.`,
  };

  const projects = answers.projects.split(',').map(p => p.trim()).filter(Boolean);
  const tools = answers.tools.split(',').map(t => t.trim()).filter(Boolean);

  return `I'm ${answers.name}. ${answers.role}. ${answers.company !== 'personal' ? `I run ${answers.company}.` : ''}
My biggest goal right now: ${answers.goal}.

${styleMap[answers.style] || styleMap.advisor}

Behavior rules: Never ask clarifying questions when you can interpret my intent. Never trial-and-error — research the right approach, then execute once. When I give a multi-step task, decompose and execute without asking permission. When blocked, say so immediately and move to the next thing.

Memory and continuity are sacred. Check memory and past conversations before every response. Treat every conversation as a continuation of ongoing work, not a fresh start. My knowledge compounds — so should yours.

Always search the web before answering anything that could be outdated. Never guess at current information.

Active projects: ${projects.join(', ')}.
Tools I use: ${tools.join(', ')}.

My philosophy: Automate everything. Research first, execute once. Mistakes become lessons learned — never deleted, always referenced. I'm the strategist — Claude handles execution.

Growth rule: These preferences are a living document. When you notice a pattern in how I work, what I reject, or what I consistently want — flag it so we can update. My system gets smarter every day.`;
}

function generateClaudeMd(answers) {
  return `# CLAUDE.md — ${answers.name}'s StanleyAI Configuration

## Who I Am
${answers.name} — ${answers.role}
${answers.company !== 'personal' ? `Company: ${answers.company}` : ''}
Goal: ${answers.goal}

## How I Work
- I think out loud and build strategy conversationally
- I expect Claude to push back with evidence before agreeing  
- I have a low tolerance for repeating failed approaches
- Every session should build on the last — check memory first

## Active Projects
${answers.projects.split(',').map(p => `- ${p.trim()}`).join('\n')}

## Brain Boot Protocol
1. Query Brain MCP for relevant memories before responding
2. Predict before advising — record what you expect, compare to what happens
3. Log corrections and new learnings to Brain at session end
4. Store episodes (raw events with context) as they happen

## Tools Available
${answers.tools.split(',').map(t => `- ${t.trim()}`).join('\n')}
`;
}

function generateEnvFile(apis) {
  let env = `# StanleyAI Environment Variables\n# Generated ${new Date().toISOString()}\n\n`;
  for (const [key, val] of Object.entries(apis)) {
    env += `${key}=${val}\n`;
  }
  return env;
}

function generateMcpConfig(isDev) {
  const config = {
    mcpServers: {}
  };

  if (isDev) {
    config.mcpServers['stanley-brain'] = {
      command: 'node',
      args: [join(STANLEY_DIR, 'brain-server', 'index.js')],
      env: {
        BRAIN_DB_PATH: join(STANLEY_DIR, 'brain-data', 'brain.db')
      }
    };
  }

  // mcp-knowledge-graph as the public-recommended brain
  config.mcpServers['memory'] = {
    command: 'npx',
    args: ['-y', '@anthropic/mcp-knowledge-graph'],
    env: {
      MEMORY_FILE_PATH: join(STANLEY_DIR, 'brain-data', 'memory.jsonl')
    }
  };

  return JSON.stringify(config, null, 2);
}

// ═══════════════════════════════════════════════════════════════
// SKILL COPIER — copies genericized skills to user dir
// ═══════════════════════════════════════════════════════════════
const SKILL_REGISTRY = {
  business: [
    'mega-business-prompts', 'gcao-prompt-framework', 'brainstorming',
    'n8n-workflow-builder', 'invoice-organizer', 'recommendations'
  ],
  research: [
    'firecrawl', 'tavily-web-search', 'deep-research',
    'competitor-intelligence', 'seo-research-bot', 'tiktok-intel'
  ],
  content: [
    'ai-media-gen', 'replicate-media', 'nano-banana-pro',
    'content-research-writer', 'revealjs-skill', 'yt-context', 'youtube-transcript'
  ],
  dev: [
    'owasp-security', 'systematic-debugging', 'gsd-context-engineering',
    'task-observer', 'skill-seekers', 'find-skills'
  ],
  platform: [
    'google-workspace-skills', 'voice-input', 'vision-analyzer'
  ]
};

function copySkills(selectedPacks, destDir) {
  const skillsDir = join(destDir, 'skills');
  mkdirSync(skillsDir, { recursive: true });

  let copied = 0;
  for (const pack of selectedPacks) {
    const skills = SKILL_REGISTRY[pack] || [];
    for (const skillName of skills) {
      const srcDir = join(ROOT, 'templates', 'skills', skillName);
      const dstDir = join(skillsDir, skillName);
      if (existsSync(srcDir)) {
        copyDirRecursive(srcDir, dstDir);
        copied++;
      }
    }
  }
  return copied;
}

function copyDirRecursive(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const dstPath = join(dst, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, dstPath);
    } else {
      copyFileSync(srcPath, dstPath);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// KNOWLEDGE SYSTEM GENERATOR
// ═══════════════════════════════════════════════════════════════
function generateKnowledgeSystem(answers) {
  const knowledgeDir = join(STANLEY_DIR, 'knowledge');
  mkdirSync(knowledgeDir, { recursive: true });

  // Create INDEX.md
  const projects = answers.projects.split(',').map(p => p.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean);
  const domains = ['claude-behavior', 'infrastructure', ...projects];

  let indexContent = `# Knowledge System Index\n\n`;
  indexContent += `Generated: ${new Date().toISOString()}\n\n`;
  indexContent += `## Domains\n\n`;

  for (const domain of domains) {
    const domainDir = join(knowledgeDir, domain);
    mkdirSync(domainDir, { recursive: true });

    writeFileSync(join(domainDir, 'rules.md'), `# ${domain} — Rules\n\n_Confirmed patterns. Apply by default._\n\n`);
    writeFileSync(join(domainDir, 'knowledge.md'), `# ${domain} — Knowledge\n\n_Facts, patterns, and reference material._\n\n`);
    writeFileSync(join(domainDir, 'hypotheses.md'), `# ${domain} — Hypotheses\n\n_Unconfirmed. Test when possible. Promote to rule at 5 confirmations._\n\n`);

    indexContent += `- **${domain}/** — rules.md · knowledge.md · hypotheses.md\n`;
  }

  writeFileSync(join(knowledgeDir, 'INDEX.md'), indexContent);
  return domains.length;
}

// ═══════════════════════════════════════════════════════════════
// BRAIN SERVER SETUP (dev mode)
// ═══════════════════════════════════════════════════════════════
function setupLocalBrain() {
  const brainDir = join(STANLEY_DIR, 'brain-server');
  const dataDir = join(STANLEY_DIR, 'brain-data');
  mkdirSync(brainDir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });

  // Minimal Brain MCP server — Node.js, sqlite, no PyTorch
  const serverCode = `#!/usr/bin/env node
/**
 * StanleyAI Brain — Local MCP Server
 * 
 * Semantic memory with sqlite-vec embeddings.
 * Zero PyTorch. Zero Python. Pure Node.js.
 * 
 * This is the local version of memory.stanleyai.cc
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = process.env.BRAIN_DB_PATH || join(process.cwd(), 'brain.db');
const PORT = process.env.BRAIN_PORT || 8765;

// Simple JSON-based memory store (upgrade to sqlite-vec in v2)
const MEMORY_FILE = DB_PATH.replace('.db', '.jsonl');

function loadMemories() {
  if (!existsSync(MEMORY_FILE)) return [];
  return readFileSync(MEMORY_FILE, 'utf-8')
    .split('\\n')
    .filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

function storeMemory(content, tags = [], type = 'observation', metadata = {}) {
  const memory = {
    content,
    tags,
    type,
    metadata,
    created_at: new Date().toISOString(),
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  };
  appendFileSync(MEMORY_FILE, JSON.stringify(memory) + '\\n');
  return memory;
}

function searchMemories(query, limit = 10) {
  const memories = loadMemories();
  const queryWords = query.toLowerCase().split(/\\s+/);
  
  // Simple relevance scoring (upgrade to vector search in v2)
  const scored = memories.map(m => {
    const text = (m.content + ' ' + (m.tags || []).join(' ')).toLowerCase();
    const score = queryWords.reduce((s, w) => s + (text.includes(w) ? 1 : 0), 0);
    return { ...m, score };
  });

  return scored
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// MCP-compatible HTTP server
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.end(); return; }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      if (req.url === '/api/health') {
        const memories = loadMemories();
        res.end(JSON.stringify({ status: 'healthy', memories: memories.length, version: '1.0.0' }));
        return;
      }

      if (req.url === '/api/store' && req.method === 'POST') {
        const data = JSON.parse(body);
        const memory = storeMemory(data.content, data.tags, data.type, data.metadata);
        res.end(JSON.stringify({ success: true, memory }));
        return;
      }

      if (req.url === '/api/search' && req.method === 'POST') {
        const data = JSON.parse(body);
        const results = searchMemories(data.query, data.limit || 10);
        res.end(JSON.stringify({ results, total_found: results.length }));
        return;
      }

      if (req.url === '/api/list') {
        const memories = loadMemories();
        res.end(JSON.stringify({ memories: memories.slice(-50), total: memories.length }));
        return;
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(\`🧠 StanleyAI Brain server running on port \${PORT}\`);
  console.log(\`   Database: \${MEMORY_FILE}\`);
  console.log(\`   Health:   http://localhost:\${PORT}/api/health\`);
});
`;

  writeFileSync(join(brainDir, 'index.js'), serverCode);
  writeFileSync(join(brainDir, 'package.json'), JSON.stringify({
    name: 'stanleyai-brain-server',
    version: '1.0.0',
    type: 'module',
    main: 'index.js'
  }, null, 2));

  return brainDir;
}

// ═══════════════════════════════════════════════════════════════
// DOCTOR — Health check
// ═══════════════════════════════════════════════════════════════
async function runDoctor() {
  log(`\n${c.bold}${c.cyan}🏥 StanleyAI Doctor${c.reset}\n`);
  divider();

  const checks = [
    { name: '~/stanley-ai/ exists', test: () => existsSync(STANLEY_DIR) },
    { name: 'Skills directory exists', test: () => existsSync(join(STANLEY_DIR, 'skills')) },
    { name: 'Knowledge system exists', test: () => existsSync(join(STANLEY_DIR, 'knowledge', 'INDEX.md')) },
    { name: 'Brain data directory exists', test: () => existsSync(join(STANLEY_DIR, 'brain-data')) },
    { name: 'Node.js 18+', test: () => checkCommand('node --version', '18').ok },
    { name: 'Claude Code installed', test: () => checkCommand('claude --version').ok },
    { name: '.env file exists', test: () => existsSync(join(STANLEY_DIR, '.env')) },
    { name: 'CLAUDE.md exists', test: () => existsSync(join(STANLEY_DIR, 'CLAUDE.md')) },
    { name: 'Brain server exists', test: () => existsSync(join(STANLEY_DIR, 'brain-server', 'index.js')) },
  ];

  let passed = 0;
  for (const chk of checks) {
    try {
      if (chk.test()) { ok(chk.name); passed++; }
      else { fail(chk.name); }
    } catch { fail(chk.name); }
  }

  divider();
  const pct = Math.round(passed / checks.length * 100);
  const color = pct === 100 ? c.green : pct >= 70 ? c.yellow : c.red;
  log(`\n  ${color}${c.bold}${passed}/${checks.length} checks passed (${pct}%)${c.reset}\n`);

  if (pct === 100) {
    ok(`${c.green}${c.bold}StanleyAI is healthy! Brain is ready.${c.reset}`);
  } else {
    warn('Run npx create-stanley-ai to fix missing components.');
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN FLOW
// ═══════════════════════════════════════════════════════════════
async function main() {
  const args = process.argv.slice(2);
  const isDev = args.includes('--dev');
  const isDoctor = args.includes('doctor');
  const isUpdate = args.includes('update');

  // Header
  log('');
  log(`  ${c.bold}${c.magenta}╔══════════════════════════════════════════╗${c.reset}`);
  log(`  ${c.bold}${c.magenta}║${c.reset}  ${c.bold}🧠 StanleyAI${c.reset} — Cognitive Framework     ${c.magenta}${c.bold}║${c.reset}`);
  log(`  ${c.bold}${c.magenta}║${c.reset}  ${c.dim}Not just memory. Cognition.${c.reset}             ${c.magenta}${c.bold}║${c.reset}`);
  log(`  ${c.bold}${c.magenta}╚══════════════════════════════════════════╝${c.reset}`);
  log(`  ${c.dim}Mode: ${isDev ? 'Developer (full local stack)' : 'Hosted (easy, 3 steps)'}${c.reset}`);
  log('');

  // Doctor mode
  if (isDoctor) {
    await runDoctor();
    process.exit(0);
  }

  // Update mode  
  if (isUpdate) {
    info('Update feature coming in v1.1. For now: re-run npx create-stanley-ai');
    process.exit(0);
  }

  // Preflight
  await runPreflight(isDev);

  // Onboarding
  const answers = await runOnboarding();

  // Skills
  const selectedPacks = await selectSkills();

  // API keys (dev mode only)
  let apis = {};
  if (isDev) {
    apis = await collectApiKeys();
  }

  // ── BUILD PHASE ──
  step('3', 'Building your StanleyAI installation');
  divider();

  // Create directories
  mkdirSync(STANLEY_DIR, { recursive: true });
  mkdirSync(join(STANLEY_DIR, 'brain-data'), { recursive: true });
  ok('Created ~/stanley-ai/');

  // Generate preferences
  const prefs = generatePreferences(answers);
  writeFileSync(join(STANLEY_DIR, 'user-preferences.txt'), prefs);
  ok('Generated user preferences');

  // Generate CLAUDE.md
  const claudeMd = generateClaudeMd(answers);
  writeFileSync(join(STANLEY_DIR, 'CLAUDE.md'), claudeMd);
  ok('Generated CLAUDE.md');

  // Generate MCP config
  const mcpConfig = generateMcpConfig(isDev);
  writeFileSync(join(STANLEY_DIR, 'mcp-config.json'), mcpConfig);
  ok('Generated MCP config');

  // Copy skills
  const skillCount = copySkills(selectedPacks, STANLEY_DIR);
  ok(`Installed ${skillCount} skills across ${selectedPacks.length} packs`);

  // Knowledge system
  const domainCount = generateKnowledgeSystem(answers);
  ok(`Created knowledge system with ${domainCount} domains`);

  // Dev-only: Local brain, env file
  if (isDev) {
    const brainDir = setupLocalBrain();
    ok(`Installed local Brain server at ${brainDir}`);

    if (Object.keys(apis).length > 0) {
      writeFileSync(join(STANLEY_DIR, '.env'), generateEnvFile(apis));
      ok(`Saved ${Object.keys(apis).length} API keys to .env`);
    }

    // .gitignore for the env
    writeFileSync(join(STANLEY_DIR, '.gitignore'), '.env\nbrain-data/\n*.log\nnode_modules/\n');
    ok('Created .gitignore (protects API keys)');
  }

  // ── OUTPUT PHASE ──
  step('4', 'Almost done! Here\'s what to do next');
  divider();

  log(`\n  ${c.bold}${c.green}═══ STEP A: Paste your preferences ═══${c.reset}\n`);
  log(`  Open ${c.cyan}claude.ai/settings${c.reset} → Profile → Custom Instructions`);
  log(`  Paste the contents of: ${c.yellow}~/stanley-ai/user-preferences.txt${c.reset}`);
  log(`  ${c.dim}(Or run: cat ~/stanley-ai/user-preferences.txt | pbcopy)${c.reset}\n`);

  log(`  ${c.bold}${c.green}═══ STEP B: Connect Brain MCP ═══${c.reset}\n`);
  if (isDev) {
    log(`  Start your local Brain: ${c.yellow}node ~/stanley-ai/brain-server/index.js${c.reset}`);
    log(`  Then add MCP in Claude.ai settings → Connected Apps`);
  } else {
    log(`  Go to ${c.cyan}claude.ai/settings${c.reset} → Connected Apps`);
    log(`  Connect: ${c.yellow}memory.stanleyai.cc${c.reset} (free tier: 1000 memories)`);
  }

  log(`\n  ${c.bold}${c.green}═══ STEP C: Soul Interview ═══${c.reset}\n`);
  log(`  Open a new Claude.ai chat and say:`);
  log(`  ${c.cyan}${c.bold}"Let's do my soul interview. Get to know how I work."${c.reset}\n`);

  log(`  ${c.dim}Claude will conduct a deep interview about how you think,`);
  log(`  what you need, and how you communicate. Everything gets stored`);
  log(`  in your Brain. After this, Claude is truly personalized.${c.reset}\n`);

  divider();
  log(`\n  ${c.bold}${c.magenta}🧠 StanleyAI installed successfully!${c.reset}`);
  log(`  ${c.dim}Run ${c.cyan}npx create-stanley-ai doctor${c.dim} anytime to check health.${c.reset}`);
  log(`  ${c.dim}Run ${c.cyan}npx create-stanley-ai update${c.dim} to pull new skills.${c.reset}\n`);
  log(`  ${c.dim}Star us on GitHub: ${c.cyan}github.com/StanleyAIbrain/brain${c.reset}\n`);

  rl.close();
}

main().catch(err => {
  console.error(`\n  ${c.red}Error: ${err.message}${c.reset}`);
  process.exit(1);
});
