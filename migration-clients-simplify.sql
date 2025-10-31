-- Migration script: Simplify clients table for logo-only display
-- This script removes unnecessary columns (industry, description) from client_content table
-- since the clients section now only displays logos

-- Step 1: Drop the columns that are no longer needed
ALTER TABLE client_content
DROP COLUMN IF EXISTS industry,
DROP COLUMN IF EXISTS description;

-- Step 2: Update existing records to ensure name and logo_url are properly set
-- Keep existing data but clean up any potential issues

-- Ensure all clients have names (should already be handled by previous migrations)
UPDATE client_content
SET name = 'Client ' || EXTRACT(EPOCH FROM created_at)
WHERE name IS NULL OR name = '' OR TRIM(name) = '';

-- Ensure logo_url is properly formatted (remove any trailing whitespace)
UPDATE client_content
SET logo_url = TRIM(logo_url)
WHERE logo_url IS NOT NULL;

-- Step 3: Add comments to document the simplified structure
COMMENT ON COLUMN client_content.name IS 'Client display name (required for identification in admin panel)';
COMMENT ON COLUMN client_content.logo_url IS 'URL to client logo image (displayed on public page)';
COMMENT ON COLUMN client_content.order_index IS 'Display order for clients on the website';

-- Step 4: Update RLS policies to reflect the simplified structure
-- Drop existing policies and recreate with updated columns
DROP POLICY IF EXISTS "Users can view client content" ON client_content;
DROP POLICY IF EXISTS "Users can insert client content" ON client_content;
DROP POLICY IF EXISTS "Users can update client content" ON client_content;
DROP POLICY IF EXISTS "Users can delete client content" ON client_content;

-- Recreate policies for simplified structure
CREATE POLICY "Users can view client content" ON client_content
    FOR SELECT USING (true);

CREATE POLICY "Users can insert client content" ON client_content
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update client content" ON client_content
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete client content" ON client_content
    FOR DELETE USING (auth.role() = 'authenticated');

-- Step 5: Update the trigger function to only handle the remaining columns
CREATE OR REPLACE FUNCTION update_client_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update the timestamp, don't check for specific column changes
    -- since we have fewer columns now
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Verify the table structure after migration
-- This query can be used to verify the migration worked correctly
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'client_content'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected columns after migration:
-- 1. id (uuid, not null, default uuid_generate_v4())
-- 2. name (text, not null)
-- 3. logo_url (text, nullable)
-- 4. order_index (integer, nullable)
-- 5. created_at (timestamp with time zone, not null, default now())
-- 6. updated_at (timestamp with time zone, not null, default now())

-- Step 7: Clean up any sequences or functions no longer needed
-- The get_next_client_order_index() function can still be useful, so we keep it

-- Final verification query to check client data
SELECT
    id,
    name,
    CASE
        WHEN logo_url IS NULL OR logo_url = '' THEN 'No Logo'
        ELSE 'Has Logo'
    END as logo_status,
    order_index,
    created_at,
    updated_at
FROM client_content
ORDER BY order_index, name;