-- Add logo_url and description columns to credential_content table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='credential_content' AND column_name='logo_url'
    ) THEN
        ALTER TABLE credential_content ADD COLUMN logo_url text;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='credential_content' AND column_name='description'
    ) THEN
        ALTER TABLE credential_content ADD COLUMN description text;
    END IF;
END $$;

-- Update existing credential data with sample descriptions and logos
UPDATE credential_content
SET
    description = 'Official license from Indonesia''s Financial Services Authority to provide investment advisory services',
    logo_url = 'https://cdn-icons-png.flaticon.com/512/2620/2620679.png'
WHERE title = 'Licensed Investment Advisor' AND (description IS NULL OR logo_url IS NULL);

UPDATE credential_content
SET
    description = 'International quality management system certification ensuring excellence in our service delivery',
    logo_url = 'https://cdn-icons-png.flaticon.com/512/2620/2620574.png'
WHERE title = 'ISO 9001:2015 Certified' AND (description IS NULL OR logo_url IS NULL);

-- Insert additional sample credentials with logos and descriptions
INSERT INTO credential_content (title, issuer, type, year, description, logo_url, order_index)
SELECT
  'Chartered Financial Analyst (CFA)',
  'CFA Institute',
  'Professional Certification',
  '2015 - Present',
  'Advanced investment management and financial analysis certification recognized globally',
  'https://cdn-icons-png.flaticon.com/512/2620/2620585.png',
  2
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM credential_content WHERE title = 'Chartered Financial Analyst (CFA)');

INSERT INTO credential_content (title, issuer, type, year, description, logo_url, order_index)
SELECT
  'Best Investment Advisory Firm 2023',
  'Indonesia Business Awards',
  'Industry Award',
  '2023',
  'Recognized as the leading investment advisory firm in Indonesia for outstanding client service',
  'https://cdn-icons-png.flaticon.com/512/2620/2620662.png',
  3
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM credential_content WHERE title = 'Best Investment Advisory Firm 2023');

-- Ensure RLS is enabled and update policies for enhanced credentials
ALTER TABLE credential_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view all credential content" ON credential_content;
DROP POLICY IF EXISTS "Authenticated users can update credential content" ON credential_content;
DROP POLICY IF EXISTS "Authenticated users can insert credential content" ON credential_content;
DROP POLICY IF EXISTS "Authenticated users can delete credential content" ON credential_content;

-- Create new policies for enhanced credentials
CREATE POLICY "Public can view all credential content" ON credential_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update credential content" ON credential_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert credential content" ON credential_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete credential content" ON credential_content FOR DELETE USING (auth.role() = 'authenticated');