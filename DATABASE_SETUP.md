# Database Setup Guide

This guide explains how to set up the Supabase database for the PT Quasar Capital CMS.

## 1. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** from the sidebar
3. Create a new query and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute the schema creation

This will create the following tables:
- `hero_content` - Main hero section content
- `service_content` - Services information
- `team_content` - Team member profiles
- `client_content` - Client list
- `credential_content` - Professional credentials
- `contact_content` - Contact information

## 2. Verify Environment Variables

Make sure your `.env` file contains the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin` and log in with your Supabase credentials

3. Go to the Hero Section editor (`/admin/hero`)

4. Try making changes and clicking "Save Changes"

You should see:
- A "Saving..." message while the data is being saved
- A green "Saved to database" notification on successful save
- A red "Failed to save" notification if there's an error

## 4. How It Works

### Loading Data
- The `useContent` hook loads data from Supabase on component mount
- It automatically updates the UI with the latest database content
- Falls back to default content if no data exists in the database

### Saving Data
- Changes are saved directly to Supabase tables
- The `updateHero` function handles both creating new records and updating existing ones
- Real-time feedback shows save status to the user

### Data Structure
The hero content is stored with these fields:
- `title` - Main headline
- `subtitle` - Secondary headline
- `description` - Main description text
- `trusted_text` - Badge text (e.g., "Trusted by Industry Leaders")
- `status` - Content status ('draft' or 'published')
- `created_at` - Automatic timestamp
- `updated_at` - Automatic timestamp (updates on save)

### Publish/Unpublish Functionality
The hero section includes a powerful publish/unpublish system:

**For Admin Users:**
- **Publish Button** (green) - Makes content visible to website visitors
- **Unpublish Button** (yellow) - Hides content from website visitors
- **Status Badge** - Shows current status (Published/Draft)
- **Admin Hook** - Can see both published and draft content

**For Public Visitors:**
- **Public Hook** - Only sees published content
- **Graceful Fallback** - Shows default content if no published content exists

**Status Management:**
- **Draft** - Content saved but not visible to public
- **Published** - Content visible on the live website
- **Real-time Updates** - Status changes take effect immediately

## 5. Security

- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can read/write data
- Your Supabase project's authentication controls access

## 6. Troubleshooting

### "Failed to save" Error
1. Check browser console for detailed error messages
2. Verify your Supabase URL and keys in `.env`
3. Ensure you're logged in with valid Supabase credentials
4. Check if the database tables were created successfully

### Loading Issues
1. Verify network connection to Supabase
2. Check if tables exist in your Supabase dashboard
3. Verify RLS policies are correctly configured

### Authentication Issues
1. Ensure Supabase Auth is enabled in your project
2. Check that your user has the correct permissions
3. Verify email confirmation if required

## 7. Database Management

You can manage the data directly in Supabase:
- Go to **Table Editor** in your Supabase dashboard
- View and edit content in any of the `_content` tables
- Changes made here will be reflected in the CMS

## 8. Next Steps

Once the hero section is working, you can extend this pattern to:
- Services editor (`/admin/services`)
- Team editor (`/admin/team`)
- Credentials editor (`/admin/credentials`)
- Contact editor (`/admin/contact`)

Each section follows the same pattern of loading from Supabase and saving changes back to the database.