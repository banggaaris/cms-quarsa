-- Simplify credential_content table structure
-- Remove unnecessary columns and keep only: id, title, description, logo_url, order_index, created_at, updated_at

-- First, create a backup of existing data
CREATE TABLE IF NOT EXISTS credential_content_backup AS
SELECT * FROM credential_content;

-- Drop the existing table and recreate with simplified structure
DROP TABLE IF EXISTS credential_content CASCADE;

-- Create simplified credential_content table
CREATE TABLE IF NOT EXISTS credential_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  logo_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for credential_content
CREATE TRIGGER update_credential_content_updated_at
  BEFORE UPDATE ON credential_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample simplified credentials data
INSERT INTO credential_content (title, description, logo_url, order_index)
SELECT
  'Licensed Investment Advisor',
  'Official license from Indonesia''s Financial Services Authority (OJK) to provide professional investment advisory services with the highest standards of compliance and ethics.',
  'https://cdn-icons-png.flaticon.com/512/2620/2620679.png',
  0
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM credential_content) LIMIT 1;

INSERT INTO credential_content (title, description, logo_url, order_index)
SELECT
  'ISO 9001:2015 Certified',
  'International quality management system certification ensuring excellence in our service delivery processes and client satisfaction standards.',
  'https://cdn-icons-png.flaticon.com/512/2620/2620574.png',
  1
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM credential_content) = 1;

INSERT INTO credential_content (title, description, logo_url, order_index)
SELECT
  'Best Investment Advisory Firm 2023',
  'Recognized as the leading investment advisory firm in Indonesia by Indonesia Business Awards for outstanding client service and innovative financial solutions.',
  'https://cdn-icons-png.flaticon.com/512/2620/2620662.png',
  2
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM credential_content) = 2;

INSERT INTO credential_content (title, description, logo_url, order_index)
SELECT
  'CFA Institute Member',
  'Certified Financial Analyst charter holder and active member of the CFA Institute, upholding the highest standards of investment analysis and portfolio management.',
  'https://cdn-icons-png.flaticon.com/512/2620/2620585.png',
  3
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM credential_content) = 3;

-- Enable Row Level Security (RLS)
ALTER TABLE credential_content ENABLE ROW LEVEL SECURITY;

-- Create policies for simplified credentials
CREATE POLICY "Public can view credential content" ON credential_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update credential content" ON credential_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert credential content" ON credential_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete credential content" ON credential_content FOR DELETE USING (auth.role() = 'authenticated');

-- Optional: You can restore data from backup if needed with this query:
-- INSERT INTO credential_content (title, description, logo_url, order_index)
-- SELECT
--   title,
--   COALESCE(description, CONCAT(issuer, ' - ', type, ' (', year, ')')),
--   logo_url,
--   order_index
-- FROM credential_content_backup ORDER BY order_index;