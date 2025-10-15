-- Add missing DELETE policies for all content tables
-- This file should be run in Supabase SQL Editor

-- Hero Content DELETE Policy
CREATE POLICY "Authenticated users can delete hero content" ON hero_content FOR DELETE USING (auth.role() = 'authenticated');

-- Service Content DELETE Policy
CREATE POLICY "Authenticated users can delete service content" ON service_content FOR DELETE USING (auth.role() = 'authenticated');

-- Team Content DELETE Policy
CREATE POLICY "Authenticated users can delete team content" ON team_content FOR DELETE USING (auth.role() = 'authenticated');

-- Client Content DELETE Policy
CREATE POLICY "Authenticated users can delete client content" ON client_content FOR DELETE USING (auth.role() = 'authenticated');

-- Credential Content DELETE Policy
CREATE POLICY "Authenticated users can delete credential content" ON credential_content FOR DELETE USING (auth.role() = 'authenticated');

-- About Content DELETE Policy
CREATE POLICY "Authenticated users can delete about content" ON about_content FOR DELETE USING (auth.role() = 'authenticated');

-- Contact Content DELETE Policy
CREATE POLICY "Authenticated users can delete contact content" ON contact_content FOR DELETE USING (auth.role() = 'authenticated');