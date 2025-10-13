-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  trusted_text text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  colors jsonb DEFAULT '{"titleColor":"#111827","subtitleColor":"#dc2626","descriptionColor":"#4b5563","trustedBadgeTextColor":"#1e40af","trustedBadgeBgColor":"#dbeafe"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on hero_content updates
CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON hero_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default hero content if table is empty
INSERT INTO hero_content (title, subtitle, description, trusted_text, status)
SELECT
  'Leading Investment Advisory Firm in Indonesia',
  'Strategic Financial Solutions for Sustainable Growth',
  'PT Quasar Capital has been the trusted partner for Indonesia''s leading companies, providing expert investment advisory services since 1994. Our team combines deep local market knowledge with global best practices.',
  'Trusted by Industry Leaders',
  'published'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

-- Create service_content table
CREATE TABLE IF NOT EXISTS service_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  features jsonb NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for service_content
CREATE TRIGGER update_service_content_updated_at
  BEFORE UPDATE ON service_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create team_content table
CREATE TABLE IF NOT EXISTS team_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  position text NOT NULL,
  email text,
  bio text,
  image_url text,
  experience text,
  education text,
  expertise text,
  specializations jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for team_content
CREATE TRIGGER update_team_content_updated_at
  BEFORE UPDATE ON team_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create client_content table
CREATE TABLE IF NOT EXISTS client_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for client_content
CREATE TRIGGER update_client_content_updated_at
  BEFORE UPDATE ON client_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create credential_content table
CREATE TABLE IF NOT EXISTS credential_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  issuer text NOT NULL,
  type text NOT NULL,
  year text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for credential_content
CREATE TRIGGER update_credential_content_updated_at
  BEFORE UPDATE ON credential_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description1 text NOT NULL,
  description2 text NOT NULL,
  mission text NOT NULL,
  vision text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for about_content
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create contact_content table
CREATE TABLE IF NOT EXISTS contact_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  business_hours_weekdays text NOT NULL,
  business_hours_saturday text NOT NULL,
  business_hours_sunday text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for contact_content
CREATE TRIGGER update_contact_content_updated_at
  BEFORE UPDATE ON contact_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default contact information
INSERT INTO contact_content (address, phone, email, business_hours_weekdays, business_hours_saturday, business_hours_sunday)
SELECT
  'PT Quasar Capital
Jakarta Stock Exchange Building
Tower 2, 15th Floor
Jakarta 12190, Indonesia',
  '+62 21 1234 5678',
  'info@quasarcapital.co.id',
  '9:00 AM - 6:00 PM',
  '9:00 AM - 1:00 PM',
  'Closed'
WHERE NOT EXISTS (SELECT 1 FROM contact_content);

-- Insert default about content if table is empty
INSERT INTO about_content (title, description1, description2, mission, vision)
SELECT
  'Leading Investment Advisory Firm',
  'Founded in 1994, PT Quasar Capital has established itself as Indonesia''s premier investment advisory firm, combining deep local expertise with global best practices.',
  'Our team of seasoned professionals brings decades of experience in investment banking, corporate restructuring, and strategic advisory services to help clients navigate complex financial challenges and seize growth opportunities.',
  'To provide exceptional investment advisory services that create sustainable value for our clients through strategic insight, operational excellence, and unwavering commitment to success.',
  'To be the most trusted investment advisory partner in Southeast Asia, recognized for our integrity, expertise, and transformative impact on businesses and economies.'
WHERE NOT EXISTS (SELECT 1 FROM about_content);

-- Insert sample service data if table is empty
INSERT INTO service_content (title, description, icon, features, order_index)
SELECT
  'Investment Advisory',
  'Strategic investment guidance to maximize portfolio returns and minimize risks',
  'Target',
  '["Portfolio Management", "Risk Assessment", "Market Analysis"]'::jsonb,
  0
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM service_content) LIMIT 1;

INSERT INTO service_content (title, description, icon, features, order_index)
SELECT
  'Corporate Restructuring',
  'Comprehensive restructuring solutions for distressed businesses',
  'Shield',
  '["Debt Restructuring", "Operational Efficiency", "Strategic Planning"]'::jsonb,
  1
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM service_content) = 1;

INSERT INTO service_content (title, description, icon, features, order_index)
SELECT
  'M&A Advisory',
  'End-to-end merger and acquisition services',
  'TrendingUp',
  '["Due Diligence", "Valuation", "Negotiation Support"]'::jsonb,
  2
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM service_content) = 2;

INSERT INTO service_content (title, description, icon, features, order_index)
SELECT
  'Financial Consulting',
  'Expert financial analysis and planning services',
  'BarChart3',
  '["Financial Modeling", "Budget Planning", "Performance Analysis"]'::jsonb,
  3
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM service_content) = 3;

-- Insert sample team data if table is empty
INSERT INTO team_content (name, position, bio, image_url, experience, education, expertise, specializations, order_index)
SELECT
  'John Anderson',
  'Managing Partner',
  'John Anderson leads PT Quasar Capital with over two decades of experience in investment strategy and mergers & acquisitions. He has successfully advised on transactions worth over $5 billion across various sectors.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  '20+ years',
  'MBA, Harvard Business School',
  'Investment Strategy, M&A',
  '["Corporate Restructuring", "Investment Banking", "Strategic M&A", "Private Equity"]'::jsonb,
  0
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM team_content) LIMIT 1;

INSERT INTO team_content (name, position, bio, image_url, experience, education, expertise, specializations, order_index)
SELECT
  'Sarah Mitchell',
  'Senior Partner',
  'Dr. Sarah Mitchell specializes in corporate restructuring and turnaround strategies. Her expertise has helped numerous companies navigate financial distress and emerge stronger.',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  '18+ years',
  'PhD, Stanford University',
  'Restructuring, Turnaround',
  '["Corporate Turnaround", "Debt Restructuring", "Operational Efficiency", "Crisis Management"]'::jsonb,
  1
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM team_content) = 1;

-- Insert sample client data if table is empty
INSERT INTO client_content (name, logo_url, order_index)
SELECT
  'Bank Central Asia',
  null,
  0
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM client_content) LIMIT 1;

INSERT INTO client_content (name, logo_url, order_index)
SELECT
  'Astra International',
  null,
  1
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM client_content) = 1;

-- Insert sample credential data if table is empty
INSERT INTO credential_content (title, issuer, type, year, order_index)
SELECT
  'Licensed Investment Advisor',
  'Financial Services Authority (OJK)',
  'Professional License',
  '2010 - Present',
  0
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM credential_content) LIMIT 1;

INSERT INTO credential_content (title, issuer, type, year, order_index)
SELECT
  'ISO 9001:2015 Certified',
  'International Organization for Standardization',
  'Quality Management',
  '2018 - Present',
  1
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM credential_content) = 1;

-- Row Level Security (RLS)
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

-- Policies to allow all authenticated users to read/write
CREATE POLICY "Users can view all hero content" ON hero_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update hero content" ON hero_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert hero content" ON hero_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all service content" ON service_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update service content" ON service_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert service content" ON service_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all team content" ON team_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update team content" ON team_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert team content" ON team_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all client content" ON client_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update client content" ON client_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert client content" ON client_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all credential content" ON credential_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update credential content" ON credential_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert credential content" ON credential_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all about content" ON about_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update about content" ON about_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert about content" ON about_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all contact content" ON contact_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update contact content" ON contact_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert contact content" ON contact_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add colors column to existing hero_content table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='hero_content' AND column_name='colors'
    ) THEN
        ALTER TABLE hero_content ADD COLUMN colors jsonb DEFAULT '{"titleColor":"#111827","subtitleColor":"#dc2626","descriptionColor":"#4b5563","trustedBadgeTextColor":"#1e40af","trustedBadgeBgColor":"#dbeafe"}'::jsonb;

        -- Update existing records with default colors
        UPDATE hero_content
        SET colors = '{"titleColor":"#111827","subtitleColor":"#dc2626","descriptionColor":"#4b5563","trustedBadgeTextColor":"#1e40af","trustedBadgeBgColor":"#dbeafe"}'::jsonb
        WHERE colors IS NULL;
    END IF;
END $$;