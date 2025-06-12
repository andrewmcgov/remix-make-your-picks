# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Remix.js application for NFL playoff predictions called "Make Your Picks". Users can predict game winners, view leaderboards, and admins can manage games and scores.

## Key Commands

### Development
- `npm run dev` - Start development server
- `npm install` - Install dependencies (automatically runs `prisma generate`)

### Database
- `npm run prisma:migrate:dev` - Create and apply new migration in development
- `npm run prisma:migrate:prod` - Deploy migrations to production (requires DATABASE_URL env var change)
- `npm run prisma:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data
- `npm run db:seed-teams` - Seed only team data
- `npm run db:reset` - Reset database

### Build
- `npm run build` - Build for production (outputs to `api/index.js` for Vercel)

## Architecture

### Tech Stack
- **Framework**: Remix.js v2 with React 18 and TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: Custom JWT + bcrypt implementation
- **Deployment**: Vercel serverless functions
- **Email**: Mailgun.js

### Key Directories
- `app/routes/` - File-based routing with admin and user flows
- `app/components/` - Reusable UI components with nested structure and index.ts exports
- `app/utilities/` - Server utilities (*.server.ts) and shared logic
- `app/styles/` - CSS files including team-specific styling
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

- TypeScript path mapping: `~/*` maps to `./app/*`
- Server-side code must use `*.server.ts` files
- Database changes require Prisma migrations
- All routes follow Remix conventions for loaders/actions
- Vercel deployment uses serverless functions with server build at `api/index.js`