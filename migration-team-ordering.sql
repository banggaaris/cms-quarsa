-- Migration for Team Ordering Enhancement
-- This migration ensures proper ordering for team members and adds missing achievements field

-- Add achievements column if it doesn't exist
ALTER TABLE team_content
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]'::jsonb;

-- Update existing team members with proper order_index if they have null values
UPDATE team_content
SET order_index = 0
WHERE name = 'John Anderson' AND (order_index IS NULL OR order_index IS DISTINCT FROM 0);

UPDATE team_content
SET order_index = 1
WHERE name = 'Sarah Mitchell' AND (order_index IS NULL OR order_index IS DISTINCT FROM 1);

-- Insert additional sample team members with proper order_index
INSERT INTO team_content (name, position, bio, image_url, experience, education, expertise, specializations, achievements, order_index)
SELECT
    'Michael Chen',
    'Partner, Technology Investments',
    'Michael Chen leads our technology investment division with extensive experience in software valuation, tech M&A, and digital transformation strategies. He has advised on over 50 technology transactions.',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face',
    '15+ years',
    'MS Computer Science, MIT',
    'Technology M&A, Software Valuation',
    '["Technology M&A", "Software Due Diligence", "Digital Transformation", "Startup Advisory"]'::jsonb,
    '["Led 200+ technology transactions", "Former Google senior engineer", "Published tech investment author"]'::jsonb,
    2
WHERE NOT EXISTS (SELECT 1 FROM team_content WHERE name = 'Michael Chen')
  AND 'Michael Chen' IS NOT NULL AND TRIM('Michael Chen') <> '';

INSERT INTO team_content (name, position, bio, image_url, experience, education, expertise, specializations, achievements, order_index)
SELECT
    'Dr. Lisa Wong',
    'Senior Partner, Healthcare',
    'Dr. Lisa Wong specializes in healthcare investments and life sciences. She brings deep domain expertise in pharmaceuticals, medical devices, and healthcare technology investments.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    '12+ years',
    'MD, Johns Hopkins University',
    'Healthcare Investments, Life Sciences',
    '["Healthcare M&A", "Pharmaceutical Investments", "Medical Devices", "Biotech"]'::jsonb,
    '["Advised on 100+ healthcare deals", "Former healthcare executive", "Published medical researcher"]'::jsonb,
    3
WHERE NOT EXISTS (SELECT 1 FROM team_content WHERE name = 'Dr. Lisa Wong')
  AND 'Dr. Lisa Wong' IS NOT NULL AND TRIM('Dr. Lisa Wong') <> '';

INSERT INTO team_content (name, position, bio, image_url, experience, education, expertise, specializations, achievements, order_index)
SELECT
    'Roberto Silva',
    'Partner, Infrastructure',
    'Roberto Silva leads our infrastructure and energy investment practice. He has extensive experience in project finance, infrastructure development, and renewable energy investments across Southeast Asia.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    '18+ years',
    'MBA, INSEAD',
    'Infrastructure Finance, Energy',
    '["Project Finance", "Infrastructure Development", "Renewable Energy", "PPP Advisory"]'::jsonb,
    '["Closed $3B+ in infrastructure deals", "Former World Bank advisor", "Infrastructure development expert"]'::jsonb,
    4
WHERE NOT EXISTS (SELECT 1 FROM team_content WHERE name = 'Roberto Silva')
  AND 'Roberto Silva' IS NOT NULL AND TRIM('Roberto Silva') <> '';

-- Insert additional team member
INSERT INTO team_content (name, position, bio, image_url, experience, education, expertise, specializations, achievements, order_index)
SELECT
    'Amanda Foster',
    'Director, ESG Investments',
    'Amanda Foster leads our Environmental, Social, and Governance (ESG) investment practice. She specializes in sustainable finance, impact investing, and ESG integration strategies.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    '10+ years',
    'MSc Environmental Economics, Yale',
    'ESG Investing, Sustainable Finance',
    '["ESG Integration", "Impact Investing", "Sustainable Finance", "Climate Risk"]'::jsonb,
    '["Pioneer ESG investor in Indonesia", "UN climate finance advisor", "Published ESG research author"]'::jsonb,
    5
WHERE NOT EXISTS (SELECT 1 FROM team_content WHERE name = 'Amanda Foster')
  AND 'Amanda Foster' IS NOT NULL AND TRIM('Amanda Foster') <> '';

-- Reset order_index to be sequential (cleanup function)
DO $$
DECLARE
    team_record RECORD;
    counter INTEGER := 0;
BEGIN
    -- Temporarily disable trigger
    ALTER TABLE team_content DISABLE TRIGGER update_team_content_updated_at;

    -- Update all records with sequential order_index
    FOR team_record IN
        SELECT id FROM team_content ORDER BY COALESCE(order_index, 999999), name
    LOOP
        UPDATE team_content
        SET order_index = counter
        WHERE id = team_record.id;
        counter := counter + 1;
    END LOOP;

    -- Re-enable trigger
    ALTER TABLE team_content ENABLE TRIGGER update_team_content_updated_at;
END $$;

-- Function to get next order index for team members
CREATE OR REPLACE FUNCTION get_next_team_order_index()
RETURNS INTEGER AS $$
DECLARE
    next_index INTEGER;
BEGIN
    -- Get the maximum current order_index
    SELECT COALESCE(MAX(order_index), 0) + 1 INTO next_index
    FROM team_content;

    RETURN next_index;
END;
$$ LANGUAGE plpgsql;

-- Add comments to document the changes
COMMENT ON COLUMN team_content.achievements IS 'Professional achievements and notable accomplishments of the team member';
COMMENT ON COLUMN team_content.order_index IS 'Display order for team members on the website';

-- Verification query to show current team data
SELECT
    id,
    name,
    position,
    order_index,
    experience,
    education,
    expertise,
    CASE
        WHEN achievements IS NOT NULL AND jsonb_array_length(achievements) > 0 THEN 'Has achievements'
        ELSE 'No achievements'
    END as achievements_status,
    created_at
FROM team_content
ORDER BY order_index, name;