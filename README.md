# Nova Café — Instagram Studio (Portfolio Demo)

A completely free, fully client-side Instagram management & automation dashboard, built as a portfolio demonstration for a fictional business, **Nova Café**.

**Live pattern:** deployable as a static site on GitHub Pages — no backend, no build step, no paid services.

## Why this exists

This project shows what an Instagram management system for a small business *could* look like, without requiring:
- Instagram Graph API / Meta Developer access
- Paid social-media management tools (Later, Buffer, Hootsuite, etc.)
- Any external automation service (Zapier, Make, etc.)

Everything — scheduling logic, the "AI" caption assistant, the hashtag generator, and the inbox automation — runs **locally in the browser** using plain JavaScript and `localStorage`. Nothing is sent to a server.

## Features

### 📅 Content Calendar
- Monthly and weekly views
- Create / edit / delete posts
- Scheduled date & time, content type, and status per post
- Content types: Reel, Carousel, Image, Story, Promotional post

### ✍️ Post Builder
Fields: caption, hashtags, content type, scheduled date/time, campaign, notes.

### ✨ AI Caption Assistant (local template engine)
Select a business type, topic, tone (Friendly / Professional / Funny / Gen Z / Luxury / Educational), audience, and call-to-action. The tool combines local phrase templates to generate several caption options — no external AI API call.

### #️⃣ Hashtag Tool
Generates a grouped hashtag set (Popular, Niche, Local, Branded) from a local dataset by business category, with an optional custom keyword.

### 💬 Inbox Simulator
Example Instagram-style conversations with:
- Mark as read/unread
- Reply
- Add an internal note
- Assign / qualify a lead (New / Cold / Warm / Hot)
- **Local keyword-detection automation rules** — e.g. a message containing "price" suggests a pricing reply, "hours" suggests the opening-hours reply, and so on. Try it live in the "Automation rules" panel.

### 📊 Analytics (clearly labeled as demo data)
Followers, reach, engagement, likes/comments/saves/shares equivalents, and leads generated — shown as sample metrics for illustration, plus campaign tracking with reach/engagement/leads per campaign.

## Tech stack

- Plain HTML / CSS / JavaScript — no frameworks, no build step
- `localStorage` for all data persistence (posts, conversations, campaigns)
- Deployed via GitHub Pages

## Running locally

Just open `index.html` in a browser — or serve the folder with any static file server. No install step required.

## Extending this into a real system

In a production version, the pieces below could be swapped in one at a time without changing the UI:
- **Instagram Graph API** for real scheduling, publishing, and inbox syncing
- A real LLM API (e.g. the Anthropic API) for genuinely generative captions, in place of the local template engine
- A backend + database (e.g. Supabase) in place of `localStorage`, to support multi-user teams

---
Built by [Saba](https://github.com/sabaghanbarlo-hash) as a freelance portfolio piece.
