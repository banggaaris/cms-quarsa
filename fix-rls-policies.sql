-- Fix RLS Policies to allow public access to published content
-- This file should be run in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view all hero content" ON hero_content;
DROP POLICY IF EXISTS "Users can update hero content" ON hero_content;
DROP POLICY IF EXISTS "Users can insert hero content" ON hero_content;

DROP POLICY IF EXISTS "Users can view all service content" ON service_content;
DROP POLICY IF EXISTS "Users can update service content" ON service_content;
DROP POLICY IF EXISTS "Users can insert service content" ON service_content;

DROP POLICY IF EXISTS "Users can view all team content" ON team_content;
DROP POLICY IF EXISTS "Users can update team content" ON team_content;
DROP POLICY IF EXISTS "Users can insert team content" ON team_content;

DROP POLICY IF EXISTS "Users can view all client content" ON client_content;
DROP POLICY IF EXISTS "Users can update client content" ON client_content;
DROP POLICY IF EXISTS "Users can insert client content" ON client_content;

DROP POLICY IF EXISTS "Users can view all credential content" ON credential_content;
DROP POLICY IF EXISTS "Users can update credential content" ON credential_content;
DROP POLICY IF EXISTS "Users can insert credential content" ON credential_content;

DROP POLICY IF EXISTS "Users can view all about content" ON about_content;
DROP POLICY IF EXISTS "Users can update about content" ON about_content;
DROP POLICY IF EXISTS "Users can insert about content" ON about_content;

DROP POLICY IF EXISTS "Users can view all contact content" ON contact_content;
DROP POLICY IF EXISTS "Users can update contact content" ON contact_content;
DROP POLICY IF EXISTS "Users can insert contact content" ON contact_content;

-- Create new policies that allow public read access to published content

-- Hero Content Policies
CREATE POLICY "Public can view published hero content" ON hero_content FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can view all hero content" ON hero_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update hero content" ON hero_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert hero content" ON hero_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Service Content Policies (always public)
CREATE POLICY "Public can view all service content" ON service_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update service content" ON service_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert service content" ON service_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Team Content Policies (always public)
CREATE POLICY "Public can view all team content" ON team_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update team content" ON team_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert team content" ON team_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Client Content Policies (always public)
CREATE POLICY "Public can view all client content" ON client_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update client content" ON client_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert client content" ON client_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Credential Content Policies (always public)
CREATE POLICY "Public can view all credential content" ON credential_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update credential content" ON credential_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert credential content" ON credential_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- About Content Policies (always public)
CREATE POLICY "Public can view all about content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update about content" ON about_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert about content" ON about_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Contact Content Policies (always public)
CREATE POLICY "Public can view all contact content" ON contact_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update contact content" ON contact_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert contact content" ON contact_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Ensure RLS is enabled on all tables
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;