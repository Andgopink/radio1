# Navidrome AI Stream

## Overview

Navidrome AI Stream is a next-generation music streaming application that integrates with Navidrome servers and provides AI-powered music discovery and interaction. The application features a modern web interface with playlist management, music library browsing, AI radio stations, and an intelligent chatbot assistant for music recommendations.

The stack is built on React with TypeScript for the frontend, Express.js for the backend, PostgreSQL with Drizzle ORM for data persistence, and integrates with external Navidrome servers for music streaming.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server.

**UI Component System**: The application uses shadcn/ui components built on Radix UI primitives, providing an accessible and customizable component library. TailwindCSS v4 handles styling with a custom design system featuring:
- Custom color variables for theming (background, foreground, primary, secondary, muted, accent, destructive)
- Font families: Inter for body text, JetBrains Mono for code, and Space Grotesk for display
- Custom radius variables for consistent border-radius values
- A "new-york" style variant from shadcn/ui

**State Management**: TanStack Query (React Query) manages server state with custom hooks abstracted in `useApi.ts`. Query client is configured with infinite stale time and disabled refetch behaviors for optimal caching.

**Routing**: Wouter provides lightweight client-side routing with routes for Home, Library, Radio, and Admin pages.

**Layout Structure**: A unified `AppLayout` component wraps all pages, consisting of:
- `Sidebar` - Left navigation with main menu items and user playlists
- `Player` - Fixed bottom music player with playback controls
- `ChatSidebar` - Right sidebar with AI assistant chat interface
- Main content area with scrollable overflow

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode. The application has separate entry points for development (`index-dev.ts`) and production (`index-prod.ts`).

**Development Mode**: Uses Vite middleware for HMR and serves the React application through Vite's development server with HTML template transformation.

**Production Mode**: Serves pre-built static files from the `dist/public` directory with fallback to `index.html` for SPA routing.

**API Layer**: RESTful API endpoints defined in `routes.ts` handle:
- Playlist CRUD operations (`/api/playlists`)
- Track management (`/api/tracks`)
- Playlist-track relationships
- Settings management for Navidrome connection
- Navidrome integration endpoints (search, import, test connection)

**Request Logging**: Custom middleware captures request/response timing and JSON responses, with truncation for readability.

**Validation**: Zod schemas generated from Drizzle schema definitions validate all incoming data.

### Data Storage

**Database**: PostgreSQL accessed through Neon's serverless driver with WebSocket support.

**ORM**: Drizzle ORM provides type-safe database operations with schema definition in `shared/schema.ts`.

**Schema Design**:
- `users` - User authentication (UUID primary key, username/password)
- `playlists` - User-created playlists with metadata (name, description, cover URL)
- `tracks` - Music track information (title, artist, album, cover URL, duration, Navidrome ID, stream URL)
- `playlist_tracks` - Many-to-many relationship with position tracking
- `settings` - Application settings for Navidrome connection (URL, username, token)

**Storage Interface**: Abstract storage layer (`IStorage`) in `storage.ts` provides consistent data access methods, making it easy to swap implementations or add caching layers.

**Migrations**: Drizzle Kit handles schema migrations with files output to `./migrations` directory.

### External Dependencies

**Navidrome Integration**: 
- Service class (`NavidromeService`) handles communication with Navidrome REST API
- Subsonic API protocol (v1.16.1) for music server interactions
- Token-based authentication with salt parameter
- Operations: search tracks, get song details, import artists

**Database Service**: 
- Neon serverless PostgreSQL for cloud-native database hosting
- WebSocket transport for connection pooling
- Connection string required via `DATABASE_URL` environment variable

**UI Component Library**:
- Radix UI primitives for accessible components
- Lucide React for icon system
- embla-carousel for carousel functionality
- react-day-picker for calendar/date selection
- cmdk for command palette interface

**Form Handling**:
- React Hook Form for form state management
- Hookform Resolvers with Zod for validation integration

**Development Tools**:
- Replit-specific plugins for development banner, runtime error overlay, and cartographer
- TypeScript with strict mode enabled
- ESBuild for production bundling

**Styling & Theming**:
- TailwindCSS v4 (using @tailwindcss/vite plugin)
- Autoprefixer for CSS vendor prefixing
- Class Variance Authority for component variant management
- tailwind-merge and clsx for conditional class handling

**Session Management**: 
- connect-pg-simple for PostgreSQL-backed session storage (dependency present but routes not yet implemented)