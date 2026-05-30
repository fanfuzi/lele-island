# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**lele-island (乐乐小岛)** is a gamified educational platform for Hong Kong primary school students (P1–F3). It teaches Cantonese, Traditional Chinese, Mathematics, English, and General Studies through game-based learning with a virtual pet companion. Mobile-first SPA, no TypeScript — all JSX.

## Commands

```bash
npm install
npm run dev          # Vite dev server (frontend, proxies /api to localhost:3001)
npm run server       # Express backend on port 3001
npm run build        # Production build to dist/
npm run deploy       # Build + deploy to GitHub Pages
npm run deploy:cf    # Build + deploy to Cloudflare Pages
npm run db:init      # Initialize D1 database schema
```

No test framework is configured. There are no lint or test commands.

## Architecture

### Tech Stack

- **Frontend:** React 19 + Vite 8, plain JavaScript (JSX), single CSS file (`src/App.css`)
- **State:** React Context + useReducer in `src/store/index.jsx` — single global store accessed via `useGame()`
- **Routing:** Manual `screen` state variable in `App.jsx` (no react-router). Valid screens: `home`, `cantonese`, `chinese`, `math`, `english`, `gs`, `pet-room`, `shop`, `stats`, `ai-chat`, `parent`, `tutor`
- **Persistence:** localStorage (offline-first) + Cloudflare D1 (online sync every 30s + on screen change)
- **Backend (local):** Express 5 in `server/index.js` with better-sqlite3
- **Backend (production):** Cloudflare Pages Functions in `functions/api/[[catchall]].js` with D1
- **AI:** Dual-provider — Anthropic Claude or Deepseek, controlled by `AI_PROVIDER` env var. Production uses Deepseek only.
- **Speech:** Web Speech API with `zh-HK` locale for Cantonese

### Key Directories

- `src/screens/` — Page-level components, one per screen
- `src/games/` — Reusable game components (QuizGame, WritingCanvas, AudioGame, MatchGame, SpeedChallenge, etc.)
- `src/components/` — Shared UI (PetCompanion, Header, RewardModal, etc.)
- `src/data/questions/` — Static question banks organized by subject
- `src/data/expansion/` — Template engine for infinite question generation from templates with variables/distractors
- `src/data/curriculum/` — Grade mapping (P1–F3 → curriculumLevel 1–9), HK curriculum codes, weekly teaching calendar
- `src/data/queryEngine.js` — Unified question query/filter: `findQuestions()`, `getBalancedQuestions()`, `getTemplateGeneratedProblems()`
- `src/store/index.jsx` — Global state reducer, `GameProvider`, `useGame()`, `GRADE_CONFIG`
- `server/` — Express backend (auth, user data, AI proxy routes)
- `functions/` — Cloudflare Pages Functions (production API)

### State Shape (in `src/store/index.jsx`)

State covers: pet (type, hunger, happiness, energy, health, cleanliness, level, exp), coins, stars, inventory, furniture, dailyProgress, streak, achievements, subject unlock levels, wrongRecords, mastery tracking, habitLog, diagnosisHistory. Auto-saves to localStorage on every change.

### Offline-First Design

On startup, checks `/api/health` with a 3-second timeout. Falls back to pure localStorage if backend is unavailable. All backend calls have fallback values — AI returns null on failure, auth degrades to offline mode.

### Grade/Curriculum System

9 grade levels: P1–P6, F1–F3. Maps to `curriculumLevel` 1–9 and `subjectLevel` 1–4. Hong Kong Education Bureau-aligned. Weekly teaching calendar in `hk-p3-calendar.js` drives daily review tasks.

### Parent/Child Accounts

Child accounts register with username/password. Parent accounts use `parent_` prefix. Parents bind children via invite code (child's username) and view activity logs/mastery in ParentDashboard.

## Key Patterns

- **Graceful degradation:** Every backend call has a fallback. Features degrade silently when APIs are unavailable.
- **Pet system:** 5 attributes (hunger, happiness, energy, health, cleanliness) with online decay (every 3min) and offline decay (elapsed time). Mood affects voice lines and animations.
- **Economy:** Coins from quests; 1 star per 10 coins. Shop sells food, clothing, furniture.
- **Writing scoring:** 10x10 grid comparison using F1 score with offset penalty (`WritingCanvas.jsx`).
- **Anti-farming:** Diminishing returns on repeated writing of same character per day.
- **Question generation:** Template engine (`src/data/expansion/templateEngine.js`) generates questions from templates with variables, constraints, answer formulas, and distractor generators. 10 question types defined in `questionSchema.js`.
