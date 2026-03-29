---
name: recommendations
description: Get personalized recommendations for movies, restaurants, products, travel destinations, and jobs via TasteRay API. Use when the user wants suggestions tailored to their preferences and history.
---
# Recommendations Skill
Personalized recommendations via TasteRay API.
## Categories
- Movies and TV shows
- Restaurants and food
- Products and gear
- Travel destinations
- Career and jobs
## How personalization works
Builds a taste profile from what the user likes/dislikes and finds similar items.
## API
https://api.tasteray.com/v1/recommend
Requires: category, seed items (things they already like), filters
## Output
Ranked list with: name, match score, reason why recommended, link
