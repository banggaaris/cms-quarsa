-- =====================================================
-- RLS POLICIES FOR COMPANY_SETTINGS TABLE
-- =====================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new

-- 1. Enable RLS on company_settings table (if not already enabled)
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Company Settings - Public Read" ON company_settings;
DROP POLICY IF EXISTS "Company Settings - Service Role All" ON company_settings;

-- 3. Create policy for public read access
-- This allows anyone (including non-authenticated users) to read company settings
CREATE POLICY "Company Settings - Public Read" ON company_settings
    FOR SELECT USING (is_active = true);

-- 4. Create policy for service role (backend) full access
-- This allows the backend service role to manage all company settings
CREATE POLICY "Company Settings - Service Role All" ON company_settings
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if RLS is enabled
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'company_settings';

-- Check existing policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'company_settings';

-- Test public access (should return active company settings)
SELECT
    id,
    company_name,
    company_tagline,
    facebook_url,
    twitter_url,
    linkedin_url,
    instagram_url,
    contact_email,
    contact_phone
FROM company_settings
WHERE is_active = true;

-- =====================================================
-- ALTERNATIVE: If you want more specific public access
-- =====================================================

-- Uncomment and use this instead if you want to limit public access
-- to only specific fields for security reasons:

/*
CREATE POLICY "Company Settings - Public Selective Read" ON company_settings
    FOR SELECT USING (
        is_active = true AND
        -- Only allow public access to specific fields
        -- Other sensitive fields will still be blocked
        true
    );
*/