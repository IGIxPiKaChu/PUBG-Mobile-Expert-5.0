# PUBG Tactical Guide

An AI-powered PUBG Mobile strategy guide that provides personalized tactical advice based on comprehensive historical update data (2018-2025).

## Features

### Core Features

- **Update History Database** - Complete PUBG Mobile update history from 2018-2025
  - Searchable by version, year, or features
  - Detailed weapon, map, and vehicle changes
  - Meta analysis and summaries

- **AI Strategy Coach** - Powered by Google Gemini AI
  - Personalized strategy recommendations based on your play style
  - Situation-specific tactical advice
  - Historical context-aware suggestions

- **Player Profile Management**
  - Track your preferred play style
  - Save favorite weapons and maps
  - Identify areas for improvement

- **Admin Upload** - Password-protected update management
  - Upload new PUBG update data via JSON
  - Secure password authentication
  - Automatic schema validation

### Special Features

- **This Day in PUBG History** - See what updates happened on this date
- **Weapon Evolution Tracker** - Visual charts showing weapon stat changes over time
- **Meta Comparison Tool** - Compare different versions side-by-side

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Shadcn UI (components)
- TanStack Query (data fetching)
- Wouter (routing)

### Backend
- **Replit**: Express.js + Node.js
- **Vercel**: Serverless Functions (Node.js)
- PostgreSQL database (via Drizzle ORM)
- Google Gemini AI API

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pubg-tactical-guide
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
ADMIN_PASSWORD=your_secure_password_here
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

Quick summary:
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Deploy to Replit

This application is already configured for Replit. Simply:
1. Fork the Repl
2. Add Secrets for environment variables
3. Run the application

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                # Backend (Replit/Express)
│   ├── index.ts          # Express server entry
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── pubgData.ts       # PUBG updates data
├── api/                  # Vercel serverless functions
│   ├── _lib/            # Shared utilities
│   ├── gemini-proxy.ts  # Gemini AI proxy
│   ├── pubg-data.ts     # PUBG data API
│   ├── pubg-upload.ts   # Admin upload API
│   └── profile.ts       # Player profile API
├── shared/              # Shared code (frontend + backend)
│   └── schema.ts        # Database schema & types
└── attached_assets/     # Static assets
```

## API Endpoints

### Replit/Express Server
- `GET /api/pubg/updates` - Get all PUBG updates
- `GET /api/pubg/updates?year=2024` - Filter by year
- `GET /api/pubg/updates?search=query` - Search updates
- `GET /api/pubg/today-in-history` - Get today's historical updates
- `GET /api/profile/:id` - Get player profile
- `POST /api/profile` - Create player profile
- `PATCH /api/profile/:id` - Update player profile

### Vercel Serverless Functions
- `GET /api/pubg-data` - Get PUBG updates
- `POST /api/pubg-upload` - Upload new updates (admin only)
- `POST /api/gemini-proxy` - Get AI strategy advice
- `GET /api/profile` - Get/create/update player profile

## Usage

### Admin Upload

1. Navigate to the "Update History" page
2. Click the upload icon in the header
3. Enter your admin password (set in `ADMIN_PASSWORD` environment variable)
4. Select a JSON file with PUBG updates
5. The data will be validated and uploaded to the database

**JSON Format Example:**
```json
[
  {
    "id": 1,
    "versionName": "3.2.0",
    "releaseDate": "2024-03",
    "year": "2024",
    "majorFeatures": ["New Season", "UI updates"],
    "weaponChanges": ["M416 recoil adjusted"],
    "mapChanges": null,
    "vehicleChanges": null,
    "metaSummary": "Minor balance adjustments"
  }
]
```

### Get AI Strategy Advice

1. Go to the "AI Strategy Coach" page
2. Either:
   - Click "Get Personalized Strategy" for general advice
   - Enter a specific question for situational advice
3. The AI will analyze your profile and provide tailored recommendations

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Type check
- `npm run db:push` - Push schema changes to database

### Adding New Features

1. Update the database schema in `shared/schema.ts` if needed
2. Add backend logic in `server/routes.ts` (Replit) or `api/` (Vercel)
3. Create/update frontend components in `client/src/`
4. Test locally before deploying

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `ADMIN_PASSWORD` | Password for admin upload | Yes (required for production) |
| `PORT` | Server port | No (defaults to 5000) |

## Security Notes

- The admin password must be set via the `ADMIN_PASSWORD` environment variable
- Use a strong, unique password for production deployments
- All API calls to Gemini go through a server-side proxy to protect the API key
- User profiles are stored with unique IDs and not linked to personal data
- Consider implementing rate limiting for the admin upload endpoint in production

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review the code comments for implementation details

---

Built with ❤️ for the PUBG Mobile community
