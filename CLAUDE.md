# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
No specific linting or testing commands are configured in package.json. TypeScript compilation is handled by Vite.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS with custom color scheme (coral/mint/lavender theme)
- **Backend**: Supabase (PostgreSQL + real-time subscriptions)
- **Routing**: React Router v7
- **UI Components**: Custom component library in `src/components/ui/`

### Application Structure
This is a **baby name guessing game** where parents create games and players join via game codes to guess baby names using clues.

**Key Flows:**
1. **Parent Flow**: Authentication → Create games → View dashboard with game stats
2. **Player Flow**: Enter game code → Join with name → Reveal clues → Submit guesses → Win screen

### Directory Structure
```
src/
├── components/          # Main game components
│   ├── ui/             # Reusable UI components (Button, Input, Modal, etc.)
│   └── [GameHeader, Timer, etc.]
├── lib/
│   └── supabase.ts     # API layer with GameAPI and AuthAPI classes
├── types/
│   └── database.ts     # TypeScript types for Supabase schema
└── [Page components]   # App.tsx, LandingPage.tsx, etc.
```

### Database Schema (Supabase)
- **parents** - Parent user profiles
- **games** - Game instances with settings and baby name
- **game_clues** - Ordered clues for each game
- **players** - Player sessions within games
- **player_guesses** - All guesses with timing/status
- **Views**: game_leaderboard, parent_games_summary

### API Layer (src/lib/supabase.ts)
- **GameAPI** - Game CRUD, player management, guess submission
- **AuthAPI** - Email/password and Google OAuth authentication
- Real-time subscriptions for live game updates

### Component Architecture Notes
✅ **Refactoring Progress**: Completed Phase 1.2 from `helpers/Refactor.md`

**Implemented Feature Components:**
- **Auth Components** (`src/components/auth/`): LoginForm, SignUpForm, GoogleAuthButton
- **Game Components** (`src/components/game/`): GameCard, GameList, GameStats, GameTimer, ClueReveal, GuessInput, GameSuccess  
- **Forms Components** (`src/components/forms/`): GameCreationForm, ClueEditor
- **Shared Components** (`src/components/shared/`): QRCodeDisplay, LoadingSpinner, ErrorBoundary

**Integration Complete:**
- `ParentAuthPage.tsx` now uses modular auth components (reduced from 400+ to ~160 lines)
- `CreateGamePage.tsx` now uses GameCreationForm component (reduced from 460+ to ~40 lines)
- `App.tsx` now uses GameTimer, ClueReveal, GuessInput, and GameSuccess components

**Remaining Opportunities:**
- Custom hooks for auth state management
- Custom hooks for game state management  
- Custom hooks for form validation
- Service layer separation (as outlined in Phase 3 of refactoring plan)

### Environment Variables
Requires Supabase configuration:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Development Notes
- Components use Tailwind with custom theme colors defined in tailwind.config.js
- Game codes are auto-generated via database function
- Real-time features use Supabase channels for live updates
- Mobile-responsive design with safe-area-inset handling