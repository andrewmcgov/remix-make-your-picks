# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 application for NFL playoff predictions called "Make Your Picks". Users can predict game winners, view leaderboards, and admins can manage games and scores. Originally built with Remix.js, migrated to React Router v7.

## Key Commands

### Development
- `npm run dev` - Start development server (uses `react-router dev`)
- `npm install` - Install dependencies (automatically runs `prisma generate`)

### Database
- `npm run prisma:migrate:dev` - Create and apply new migration in development
- `npm run prisma:migrate:prod` - Deploy migrations to production (requires DATABASE_URL env var change)
- `npm run prisma:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data
- `npm run db:seed-teams` - Seed only team data
- `npm run db:reset` - Reset database

### Build
- `npm run build` - Build for production using React Router (outputs to `build/` directory)
- `npm run start` - Start production server from build output (uses `react-router-serve`)

## Architecture

### Tech Stack
- **Framework**: React Router v7 with Vite bundler, React 18 and TypeScript
- **Module System**: ESM (ES Modules) with `"type": "module"` in package.json
- **Bundler**: Vite 6 (configured for React Router v7)
- **Database**: MySQL with Prisma ORM
- **Authentication**: Custom JWT + bcrypt implementation
- **Deployment**: Vercel serverless functions with ESM support
- **Email**: Mailgun.js

### Key Directories
- `app/routes/` - File-based routing with admin and user flows
- `app/routes.ts` - Route configuration using `@react-router/fs-routes`
- `app/components/` - Reusable UI components with nested structure and index.ts exports
- `app/utilities/` - Server utilities (*.server.ts) and shared logic
- `app/styles/` - CSS files including team-specific styling
- `api/` - Vercel serverless function entry point
- `prisma/` - Database schema and migrations
- `scripts/` - Database seeding and utility scripts

### Database Schema
Core entities: User (with admin flags), Team (NFL teams), Game (with playoff flags), Pick (user predictions), LeaderboardEntry (scoring by playoff round), TieBreaker (Super Bowl score predictions).

### Component Architecture
Components are organized in directories with index.ts files for clean imports. Complex components like GameCard have nested sub-components (PickContent, PicksList, etc.) that handle different game states (pregame, midgame, postgame).

### Authentication & Authorization
Custom authentication using JWT tokens stored in cookies. Admin functionality is protected by `isAdmin` user flag. Password reset uses temporary tokens with expiry.

### Scoring System
Leaderboard tracks points by playoff round (wildcard, division, conference, superbowl) with tiebreaker system using Super Bowl total score predictions.

## Development Notes

- **Vite Configuration**: Uses `vite.config.ts` with React Router Vite plugin (`@react-router/dev/vite`)
- **Route Configuration**: Uses `app/routes.ts` with `flatRoutes()` from `@react-router/fs-routes`
- **Module System**: ESM-only project with `"type": "module"` - no CommonJS support
- **TypeScript path mapping**: `~/*` maps to `./app/*` (configured in both tsconfig.json and vite.config.ts)
- **Server-side code**: Must use `*.server.ts` files and be placed in `app/utilities/` (not `app/routes/`)
- **CSS imports**: Use `?url` suffix for file URL imports (e.g., `import styles from './styles.css?url'`)
- **Development server**: Runs on port 5173 with Vite HMR (Hot Module Replacement)
- **Database changes**: Require Prisma migrations
- **All routes**: Follow React Router conventions for loaders/actions (same as Remix)
- **Import statements**: Use `'react-router'` instead of `'@remix-run/react'` or `'@remix-run/node'`
- **Vercel deployment**: Uses ESM-compatible `api/index.js` entry point that exports from `build/server/index.js`
- **Build output**: Client assets in `build/client/`, server bundle in `build/server/` (ESM format)
- **Cache directories**: `.react-router/` contains build cache and type generation (gitignored)