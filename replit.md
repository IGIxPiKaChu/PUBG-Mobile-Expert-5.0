# PUBG Tactical Guide

## Overview

PUBG Tactical Guide is an AI-powered mobile-first progressive web application (PWA) that serves as a comprehensive PUBG Mobile strategy coach and historical database. The application combines a complete update history from 2018-2025 with Google Gemini AI to provide personalized tactical advice based on player profiles and game evolution data.

**Primary Purpose:** Help PUBG Mobile players improve their gameplay through AI-generated strategies informed by the complete history of game updates, weapon balancing, and meta shifts.

**Target Platform:** Mobile-first PWA deployed on Vercel with serverless backend functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript as the core framework
- Vite for fast development and optimized production builds
- Wouter for lightweight client-side routing (5 main routes: Home, History, Coach, Profile, Admin)

**UI Component Strategy:**
- Shadcn UI component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Material Design 3-inspired gaming aesthetic with tactical theming
- Custom fonts: Inter (body) and Rajdhani (headings/stats) for tactical feel

**State Management:**
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI state
- LocalStorage for persisting player profile IDs

**Design Philosophy:**
- Mobile-first responsive design with bottom navigation
- Touch-optimized interface (48px minimum touch targets)
- PWA-ready with theme toggling (light/dark mode)
- Gaming-inspired color scheme with accent colors for tactical feel

### Backend Architecture

**Dual Runtime Strategy:**
The application supports two deployment patterns:

1. **Vercel Serverless (Production):**
   - Node.js serverless functions in `/api` directory
   - Each endpoint is a separate serverless function
   - Stateless request handling optimized for Vercel's edge network

2. **Express.js (Development/Replit):**
   - Traditional Express server in `/server` directory
   - Full-featured development server with Vite middleware
   - Hot module replacement for rapid development

**API Design:**
- RESTful endpoints organized by feature domain
- Consistent error handling and response formats
- Password-protected admin endpoints for data management
- Proxy pattern for external API calls (Gemini AI)

**Key Backend Services:**
- `/api/pubg-data` - PUBG update history queries (year filter, search, today-in-history)
- `/api/profile` - Player profile CRUD operations
- `/api/gemini-proxy` - AI strategy generation (proxies Google Gemini API)
- `/api/pubg-upload` - Admin-only update data ingestion

### Database Layer

**ORM & Database:**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (recommended: Neon or Supabase)
- Connection pooling via `@neondatabase/serverless` for serverless compatibility

**Schema Design:**
Three primary tables with clear separation of concerns:

1. **pubg_updates** - Historical game update data
   - Stores version name, release date, year
   - JSONB arrays for features, weapon/map/vehicle changes
   - Meta summaries describing impact on gameplay

2. **player_profiles** - User gameplay preferences
   - UUID primary keys
   - JSONB arrays for multi-select fields (weapons, maps, challenges)
   - Play style categorization (aggressive/passive/balanced)

3. **users** - Authentication (minimal implementation)
   - Basic username/password storage
   - Currently underutilized (authentication not fully implemented)

**Database Access Patterns:**
- Singleton pattern for database client initialization
- Separation between development (in-memory fallback) and production (PostgreSQL)
- Schema validation using Zod for runtime type safety

### External Dependencies

**Google Gemini AI Integration:**
- **Purpose:** Generate personalized PUBG strategy advice
- **Model:** gemini-1.5-flash for fast, cost-effective responses
- **Authentication:** API key via `GEMINI_API_KEY` environment variable
- **Implementation:** Serverless proxy to keep API keys secure
- **Prompt Engineering:** Context-aware prompts combining player profile with historical update data

**PostgreSQL Database (Neon/Supabase):**
- **Purpose:** Primary data persistence layer
- **Access:** Connection string via `DATABASE_URL` environment variable
- **Features Required:** JSONB support for flexible array storage
- **Migration Strategy:** Drizzle Kit push for schema synchronization

**Vercel Platform Services:**
- **Hosting:** Static assets and serverless functions
- **Build Pipeline:** Automated builds from Git repository
- **Environment Variables:** Secure storage for API keys and database credentials
- **Edge Network:** Global CDN for fast content delivery

**Development Tools:**
- **Replit Integration:** Optional development plugins for Replit environment
- **TypeScript Compilation:** Strict type checking across frontend and backend
- **Build Process:** Separate frontend (Vite) and backend (esbuild) compilation

**Environment Configuration Requirements:**
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google AI API key
- `ADMIN_PASSWORD` - Password for protected upload endpoints
- `NODE_ENV` - Runtime environment flag

**Third-Party UI Libraries:**
- Recharts for weapon evolution visualization
- Lucide React for consistent iconography
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation