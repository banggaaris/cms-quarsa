# Supabase Authentication Setup

This document explains how to set up Supabase authentication for the PT Quasar Capital admin portal.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/login and create a new project
4. Choose your database region (preferably close to your users)
5. Set a database password (save it securely)
6. Wait for the project to be created

## 2. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Project Settings (gear icon)
3. Under "Configuration" > "API", find:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public** key: `eyJ...`

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace with your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

## 4. Configure Supabase Authentication

1. In your Supabase project, go to "Authentication" > "Settings"
2. Under "Site URL", add: `http://localhost:5173` (for development)
3. Add additional URLs for production:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

## 5. Create Admin Users

1. In Supabase, go to "Authentication" > "Users"
2. Click "Add user"
3. Enter the admin email and password
4. Make sure to verify the email (check your email for verification link)

## 6. Run the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to `/admin` in your browser

## 7. Test Authentication

1. You should see the login page
2. Enter your admin credentials
3. After successful login, you'll be redirected to the admin dashboard
4. The user's email will be displayed in the sidebar
5. You can sign out using the "Sign Out" button

## Features Implemented

- ✅ Login page with email/password authentication
- ✅ Protected routes (all /admin routes require authentication)
- ✅ User session management
- ✅ Sign out functionality
- ✅ Responsive design
- ✅ Error handling for failed login attempts
- ✅ Loading states

## Security Notes

- Passwords are never stored in the application code
- Supabase handles password hashing and security
- Session tokens are managed securely by Supabase client
- The application uses HTTPS in production (recommended)

## Troubleshooting

### "Invalid login credentials" error
- Verify the email and password are correct
- Make sure the user is verified in Supabase
- Check that the user exists in Supabase Authentication

### "CORS" or "Network" errors
- Verify your environment variables are correctly set
- Check that your site URL is configured in Supabase settings
- Ensure your Supabase project URL and anon key are correct

### Build fails
- Make sure all environment variables are set
- Check that TypeScript compilation succeeds
- Verify all imports are correct

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJ...` |