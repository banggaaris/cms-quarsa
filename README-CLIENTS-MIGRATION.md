# Clients Database Migration

## Overview
This migration enhances the `client_content` table to support managing client information with industry, description, and logo URL fields.

## Files Created/Modified

### Database Migration
- `migration-clients-enhance.sql` - SQL script to add `industry` and `description` columns to the `client_content` table

### New Components
- `src/hooks/useClientsContent.ts` - Custom hook for clients data management
- `src/components/admin/ClientsEditor.tsx` - React component for client management UI

### Modified Files
- `src/types/content.ts` - Updated Client interface to include `logo_url` field
- `src/hooks/useContent.ts` - Updated to handle enhanced client data
- `src/pages/AdminApp.tsx` - Added `/admin/clients` route
- `src/components/admin/AdminLayout.tsx` - Updated navigation icon for Clients

## How to Apply the Migration

### Step 1: Apply SQL Migration
Run the migration script in your Supabase SQL editor:

```sql
-- Run the contents of migration-clients-enhance.sql
```

This will:
- Add `industry` and `description` columns to `client_content` table
- Update existing clients with sample data
- Insert additional sample clients

### Step 2: Verify Database Structure
Check that the `client_content` table now has the new columns:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'client_content'
ORDER BY ordinal_position;
```

Expected columns:
- id (uuid)
- name (text)
- industry (text) - NEW
- description (text) - NEW
- logo_url (text)
- order_index (integer)
- created_at (timestamptz)
- updated_at (timestamptz)

## Features Available

### Client Management at `/admin/clients`
- ✅ **View all clients** in a responsive grid layout
- ✅ **Drag and drop reordering** - Reorder clients by dragging
- ✅ **Add new clients** with name, industry, description, and logo URL
- ✅ **Edit existing clients** with inline editing
- ✅ **Delete clients** with confirmation dialog
- ✅ **Logo URL validation** with preview
- ✅ **Real-time updates** to database
- ✅ **Error handling** and loading states
- ✅ **Visual feedback** during dragging with transparency and shadow effects

### Fields Available
- **Name** - Client company name (required)
- **Industry** - Industry sector (required)
- **Description** - Brief description of client relationship (required)
- **Logo URL** - URL to client logo image (optional)

### Sample Data Included
The migration includes sample clients:
- Bank Central Asia (Banking & Financial Services)
- Astra International (Automotive & Manufacturing)
- Telkom Indonesia (Telecommunications & Digital Services)
- Unilever Indonesia (Consumer Goods & FMCG)
- Pertamina (Energy & Oil & Gas)
- Bank Mandiri (Banking & Financial Services)
- Garuda Indonesia (Aviation & Transportation)

## Testing the Implementation

1. Navigate to `/admin/clients` in your admin panel
2. Try adding a new client with all required fields
3. Test editing an existing client
4. Verify logo URL validation works correctly
5. Test the delete functionality
6. **Test drag and drop reordering**:
   - Drag client cards to reorder them
   - Verify the order persists after page refresh
   - Check that the order is reflected in the main website
7. Check that changes are reflected in the main website

## Ordering Features

### How Drag and Drop Works
- **Grip Handle**: Each client card has a grip handle (vertical dots) on the left
- **Visual Feedback**: Cards become semi-transparent and gain a blue border when dragging
- **Drop Zones**: Cards can be dropped between other cards to reorder
- **Auto-save**: New order is automatically saved to the database
- **Keyboard Support**: Use arrow keys to navigate and reorder with accessibility features

### Order Management
- **Database**: Order is stored in the `order_index` column (0, 1, 2, ...)
- **Automatic**: New clients are automatically assigned the next available order index
- **Cleanup**: Migration includes a function to reset sequential ordering if needed
- **Fallback**: Clients without order_index are ordered alphabetically by name

## Integration with Main Website

The enhanced client data will be automatically available in:
- The main website's clients section
- The infinite slider component
- Any other component using the `useContent` hook

## Notes
- All database operations are protected by Row Level Security (RLS)
- Only authenticated users can access the clients management
- The interface follows the same design patterns as other admin sections
- Responsive design works on desktop, tablet, and mobile devices