---
name: owasp-security
description: Apply OWASP Top 10:2025, ASVS 5.0, and Agentic AI security to all code. Use whenever writing backend code, APIs, authentication, or any security-sensitive system. Auto-reviews for common vulnerabilities.
---

# OWASP Security Skill

OWASP Top 10:2025 applied to every code output.

## Top 10 (2025)
1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, NoSQL, Command)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Software Integrity Failures
9. Logging/Monitoring Failures
10. SSRF

## Auto-checklist (every code output)
- Input validation at all entry points
- Parameterized queries only — never string concat
- Auth on every protected route
- Rate limiting on public endpoints
- Secrets in env vars only
- HTTPS enforced
- CORS configured correctly
- Errors don't leak internals
