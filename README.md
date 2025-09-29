# Workout Tracker PWA

A comprehensive Progressive Web App for tracking workouts, exercises, and fitness progress. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 💪 **Exercise Database** - Pre-populated with common exercises + custom exercise creation
- 🏋️ **Workout Management** - Create, edit, and organize custom workouts
- 📊 **Progress Tracking** - Detailed session logging with sets, reps, and weights
- 📅 **Workout Scheduling** - Schedule workouts with notifications
- 📱 **PWA Support** - Install as mobile app with offline capabilities
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **PWA:** next-pwa for offline support
- **Icons:** Heroicons
- **Package Manager:** pnpm

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (`npm install -g pnpm`)
- Docker (for local Supabase)

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd workout-tracker-pwa
   pnpm install
   ```

2. **Start Supabase locally:**
   ```bash
   npx supabase start
   ```
   This will pull Docker images and start local Supabase services.

3. **Copy environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   The local Supabase credentials will be displayed in the terminal.

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000)

### Database Schema

The app includes a comprehensive database schema with:
- **Users & Profiles** - User management with extended profile data
- **Exercises** - System and custom exercises with muscle group categorization
- **Workouts** - Custom workout templates with exercise sequences
- **Sessions** - Logged workout sessions with detailed set/rep/weight tracking
- **Scheduling** - Workout scheduling with recurring options

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (for migrations)
DATABASE_URL=your_database_connection_string
```

## Deployment

### Deploy to Vercel

1. **Set up Production Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project credentials (URL, anon key, service role key)

2. **Create production environment file:**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your actual Supabase credentials
   ```

3. **Sync environment variables to Vercel:**
   ```bash
   # Login to Vercel first
   npx vercel login
   
   # Sync all variables from .env.production to Vercel
   pnpm sync-env
   ```

   **🎯 Automatic Sync**: Environment variables are automatically synced when you push to `main` branch thanks to Husky pre-push hooks!

4. **Push to GitHub and deploy:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **Run database migrations:**
   ```bash
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

### PWA Installation

Once deployed, users can install the app on their devices:
- **iOS Safari:** Share → Add to Home Screen
- **Android Chrome:** Menu → Add to Home Screen
- **Desktop:** Install button in address bar

## Development Commands

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run ESLint

# Database
npx supabase start      # Start local Supabase
npx supabase stop       # Stop local Supabase
npx supabase db reset   # Reset database with fresh migrations
npx supabase gen types typescript --local > src/lib/database.types.ts  # Generate types

# Environment Variable Sync
pnpm sync-env           # Sync .env.production to Vercel (interactive)
pnpm sync-env:safe      # Sync with better error handling (for hooks)
pnpm sync-env:bash      # Bash version of sync script
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── exercises/          # Exercise management
│   ├── workouts/          # Workout creation and management
│   ├── history/           # Workout session history
│   ├── schedule/          # Workout scheduling
│   ├── auth/              # Authentication flows
│   └── login/             # Login page
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   └── layout/            # Layout components (navigation, etc.)
├── lib/                   # Utility functions and configurations
│   ├── supabase.ts        # Supabase client (browser)
│   ├── supabase-server.ts # Supabase client (server)
│   └── database.types.ts  # Generated TypeScript types
└── middleware.ts          # Next.js middleware for auth
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
