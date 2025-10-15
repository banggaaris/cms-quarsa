-- Company Settings and SEO Configuration
-- This migration creates a table for managing company information and SEO settings

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL DEFAULT 'PT Quasar Capital',
    company_tagline VARCHAR(255) DEFAULT 'Investment Advisory Excellence',
    company_description TEXT,
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    website_url VARCHAR(500) DEFAULT 'https://quasarcapital.co.id',
    contact_email VARCHAR(255) DEFAULT 'info@quasarcapital.co.id',
    contact_phone VARCHAR(100) DEFAULT '+62 21 1234 5678',
    address TEXT,

    -- SEO Settings
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_image_url VARCHAR(500),
    twitter_handle VARCHAR(100),

    -- Social Media Links
    facebook_url VARCHAR(500),
    twitter_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    instagram_url VARCHAR(500),

    -- Configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default company settings
INSERT INTO company_settings (
    company_name,
    company_tagline,
    company_description,
    website_url,
    contact_email,
    contact_phone,
    address,
    meta_title,
    meta_description,
    meta_keywords,
    og_image_url
) VALUES (
    'PT Quasar Capital',
    'Investment Advisory Excellence',
    'Leading investment advisory firm in Indonesia since 1994, providing comprehensive financial solutions and strategic guidance.',
    'https://quasarcapital.co.id',
    'info@quasarcapital.co.id',
    '+62 21 1234 5678',
    'Jakarta, Indonesia',
    'PT Quasar Capital - Investment Advisory Excellence',
    'Leading investment advisory firm in Indonesia providing comprehensive financial solutions, M&A advisory, and strategic guidance.',
    'investment advisory, financial consulting, PT Quasar Capital, M&A advisory, corporate restructuring, Indonesia investment',
    '/hero-og-image.jpg'
) ON CONFLICT DO NOTHING;

-- Enable RLS on company_settings
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for company_settings
-- Allow authenticated users to read company settings
CREATE POLICY "Authenticated users can read company settings" ON company_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update company settings
CREATE POLICY "Authenticated users can update company settings" ON company_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert company settings
CREATE POLICY "Authenticated users can insert company settings" ON company_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_company_settings_active ON company_settings(is_active);

-- Create helper function to get active company settings
CREATE OR REPLACE FUNCTION get_active_company_settings()
RETURNS TABLE (
    id UUID,
    company_name VARCHAR(255),
    company_tagline VARCHAR(255),
    company_description TEXT,
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    website_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),
    address TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_image_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    facebook_url VARCHAR(500),
    twitter_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    instagram_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cs.id,
        cs.company_name,
        cs.company_tagline,
        cs.company_description,
        cs.logo_url,
        cs.favicon_url,
        cs.website_url,
        cs.contact_email,
        cs.contact_phone,
        cs.address,
        cs.meta_title,
        cs.meta_description,
        cs.meta_keywords,
        cs.og_image_url,
        cs.twitter_handle,
        cs.facebook_url,
        cs.twitter_url,
        cs.linkedin_url,
        cs.instagram_url,
        cs.created_at,
        cs.updated_at
    FROM company_settings cs
    WHERE cs.is_active = true
    ORDER BY cs.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;