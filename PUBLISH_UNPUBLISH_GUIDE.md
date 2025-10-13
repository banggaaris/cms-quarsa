# Publish/Unpublish Feature Guide

This guide explains how to use the publish/unpublish functionality for the hero section.

## 🚀 Quick Setup

1. **Update Database Schema**
   - Go to your Supabase SQL Editor
   - Run the updated schema from `supabase-schema.sql`
   - This adds the `status` field to the `hero_content` table

2. **Restart Development Server**
   ```bash
   npm run dev
   ```

## 📋 How to Use Publish/Unpublish

### In the Admin Panel (`/admin/hero`)

1. **Status Badge**
   - **Green** = Published (visible to website visitors)
   - **Yellow** = Draft (hidden from website visitors)
   - Located below the page title

2. **Publish Button** (Green)
   - Appears when content is in draft status
   - Click to make content visible to public visitors
   - Shows "Publishing..." while processing
   - Button disappears after successful publish

3. **Unpublish Button** (Yellow)
   - Appears when content is published
   - Click to hide content from public visitors
   - Shows "Unpublishing..." while processing
   - Button disappears after successful unpublish

4. **Save Changes Button**
   - Always saves your edits to the database
   - Works independently of publish status
   - Shows "Saving..." while processing

## 🔄 Workflow Examples

### Example 1: Create New Content
1. Edit hero section (title, subtitle, description, etc.)
2. Click "Save Changes" → Content saved as draft
3. Click "Publish" → Content goes live on website

### Example 2: Update Live Content
1. Make changes to published content
2. Click "Save Changes" → Updates saved, content stays live
3. Content remains published unless you unpublish it

### Example 3: Temporary Removal
1. Click "Unpublish" → Content hidden from website
2. Content remains saved in database
3. Click "Publish" when ready to go live again

## 🎯 What Users See

### Admin Users
- Can see both published and draft content
- Can edit content regardless of status
- Can change publish status at any time
- Status indicators show current state

### Website Visitors
- **Only see published content**
- See default content if no published content exists
- Cannot see or access draft content
- Changes take effect immediately when published

## 🔧 Technical Details

### Database Structure
```sql
-- status field values
'draft'     = Content saved but not visible to public
'published' = Content visible on live website
```

### Content Loading
- **Public View**: `useContent()` hook → Only loads `status = 'published'`
- **Admin View**: `useAdminContent()` hook → Loads all statuses

### Real-time Updates
- Status changes take effect immediately
- No need to refresh or restart
- Content updates are instant

## 🛠️ Troubleshooting

### "Publish button not working"
- Check if you're logged in correctly
- Verify Supabase connection
- Check browser console for errors

### "Content not showing on website"
- Verify content status is "published"
- Check if `useContent()` hook is used in App.tsx
- Verify database has published content

### "Status not updating"
- Refresh the admin page
- Check network connection
- Verify database permissions

## 📝 Best Practices

1. **Save First, Publish Second**
   - Always save your changes before publishing
   - Ensure content looks correct in preview

2. **Use Draft for Testing**
   - Keep major changes as draft until ready
   - Test thoroughly before publishing

3. **Unpublish for Maintenance**
   - Unpublish during major updates
   - Republish when ready

4. **Status Workflow**
   - Draft → Edit → Save → Test → Publish
   - Published → Edit → Save → Test (stays published)

The publish/unpublish system gives you complete control over when content goes live, allowing for safe content management and instant updates.