# PUBG Tactical Guide - Vercel Deployment Guide

This guide will help you deploy the PUBG Tactical Guide application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A GitHub account
3. A PostgreSQL database (recommended: [Neon](https://neon.tech) or [Supabase](https://supabase.com))
4. A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Step 1: Set Up Database

### Option A: Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it should look like: `postgresql://user:password@hostname/dbname`)
4. Run the database migration:

```bash
# Set your DATABASE_URL
export DATABASE_URL="your_neon_connection_string"

# Push the schema to your database
npm run db:push
```

### Option B: Using Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Project Settings > Database
3. Copy the connection string (Connection Pooling recommended)
4. Run the same migration command as above

## Step 2: Seed the Database

You'll need to populate your database with the initial PUBG updates data. You can do this in two ways:

### Option A: Seed Script (Coming soon)
```bash
# Create a seed script to import the data
npm run db:seed
```

### Option B: Admin Upload (After Deployment)
1. Deploy the application first (follow steps below)
2. Visit your deployed app
3. Go to the "Update History" page
4. Click the Upload icon
5. Enter your admin password (set in `ADMIN_PASSWORD` environment variable)
6. Upload the `PUBG_updates_sample.json` file

## Step 3: Prepare for Deployment

1. Make sure all changes are committed to your GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Ensure your `.env.example` file is up to date (do NOT commit your actual `.env` file)

## Step 4: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will automatically detect it's a Vite project
4. Configure the following settings:

**Build Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist/client`
- Install Command: `npm install`

**Environment Variables:**
Add the following environment variables in Vercel:

```
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
ADMIN_PASSWORD=your_secure_password_here
```

5. Click "Deploy"

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

## Step 5: Configure Environment Variables

After deployment, you need to add your environment variables:

1. Go to your project dashboard on Vercel
2. Click "Settings" > "Environment Variables"
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |
| `GEMINI_API_KEY` | Your Google Gemini API key | Production, Preview, Development |
| `ADMIN_PASSWORD` | Your secure admin password | Production, Preview, Development |

4. Redeploy the application to apply the environment variables:

```bash
vercel --prod
```

## Step 6: Verify Deployment

1. Visit your deployed application URL (e.g., `https://your-app.vercel.app`)
2. Test the following features:
   - ✅ Home page loads correctly
   - ✅ Update History displays data
   - ✅ Admin upload works with your configured password
   - ✅ Profile management saves data
   - ✅ AI Strategy Coach generates advice

## Troubleshooting

### Issue: "Database connection failed"

**Solution:** Verify your `DATABASE_URL` environment variable is correct and the database is accessible from Vercel's servers.

### Issue: "Gemini API error"

**Solution:** 
1. Check that your `GEMINI_API_KEY` is valid
2. Ensure the API key has the correct permissions
3. Check the Gemini API quota/limits

### Issue: "Build failed"

**Solution:**
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are listed in `package.json`
3. Try building locally: `npm run build`

### Issue: "API routes return 404"

**Solution:** Vercel serverless functions should be in the `api/` directory. Check that your API files are correctly placed.

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request

## Custom Domain

To add a custom domain:

1. Go to your project in Vercel
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Performance Optimization

For better performance on Vercel:

1. **Enable Edge Functions** (if needed):
   - Add `export const config = { runtime: 'edge' }` to your API routes

2. **Enable Image Optimization**:
   - Use Vercel's Image Optimization by using `next/image` or Vercel's image CDN

3. **Cache Static Assets**:
   - Static assets in `dist/client` are automatically cached by Vercel

## Monitoring

Monitor your application:

1. **Vercel Analytics**: Enable in project settings
2. **Runtime Logs**: View in Vercel dashboard under "Deployments" > "Functions"
3. **Error Tracking**: Consider integrating Sentry or similar service

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Database Issues**: Check your database provider's documentation
- **Gemini API**: [Google AI Documentation](https://ai.google.dev/docs)

---

**Note**: For local development, this application uses an Express server which works great on Replit. The Vercel deployment uses serverless functions for the backend instead.
