-- Add industry and description columns to client_content table
ALTER TABLE client_content
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS description text;

-- Fix any existing null names before proceeding
-- This prevents the NOT NULL constraint violation
UPDATE client_content
SET name = 'Unnamed Client ' || EXTRACT(EPOCH FROM created_at)
WHERE name IS NULL OR name = '' OR TRIM(name) = '';

-- Update existing clients with industry, description, and proper order_index
UPDATE client_content
SET
    industry = 'Banking & Financial Services',
    description = 'One of Indonesia''s largest private banks and a leading financial institution in Southeast Asia.',
    order_index = 0
WHERE name = 'Bank Central Asia' AND (industry IS NULL OR order_index IS NULL);

UPDATE client_content
SET
    industry = 'Automotive & Manufacturing',
    description = 'A leading automotive company in Indonesia with diversified business interests in manufacturing, finance, and technology.',
    order_index = 1
WHERE name = 'Astra International' AND (industry IS NULL OR order_index IS NULL);

-- Insert additional sample clients with proper order_index
-- Only insert if they don't already exist and name is not null/empty
INSERT INTO client_content (name, industry, description, logo_url, order_index)
SELECT
    'Telkom Indonesia',
    'Telecommunications & Digital Services',
    'Indonesia''s largest telecommunications company providing digital and network services nationwide.',
    null,
    2
WHERE NOT EXISTS (SELECT 1 FROM client_content WHERE name = 'Telkom Indonesia')
  AND 'Telkom Indonesia' IS NOT NULL AND TRIM('Telkom Indonesia') <> '';

INSERT INTO client_content (name, industry, description, logo_url, order_index)
SELECT
    'Unilever Indonesia',
    'Consumer Goods & FMCG',
    'A leading consumer goods company providing daily products that improve quality of life for Indonesian households.',
    null,
    3
WHERE NOT EXISTS (SELECT 1 FROM client_content WHERE name = 'Unilever Indonesia')
  AND 'Unilever Indonesia' IS NOT NULL AND TRIM('Unilever Indonesia') <> '';

INSERT INTO client_content (name, industry, description, logo_url, order_index)
SELECT
    'Pertamina',
    'Energy & Oil & Gas',
    'Indonesia''s state-owned oil and gas corporation playing a vital role in the national energy sector.',
    null,
    4
WHERE NOT EXISTS (SELECT 1 FROM client_content WHERE name = 'Pertamina')
  AND 'Pertamina' IS NOT NULL AND TRIM('Pertamina') <> '';

INSERT INTO client_content (name, industry, description, logo_url, order_index)
SELECT
    'Bank Mandiri',
    'Banking & Financial Services',
    'One of Indonesia''s largest state-owned banks providing comprehensive banking and financial solutions.',
    null,
    5
WHERE NOT EXISTS (SELECT 1 FROM client_content WHERE name = 'Bank Mandiri')
  AND 'Bank Mandiri' IS NOT NULL AND TRIM('Bank Mandiri') <> '';

INSERT INTO client_content (name, industry, description, logo_url, order_index)
SELECT
    'Garuda Indonesia',
    'Aviation & Transportation',
    'Indonesia''s national flag carrier airline connecting the archipelago and serving international destinations.',
    null,
    6
WHERE NOT EXISTS (SELECT 1 FROM client_content WHERE name = 'Garuda Indonesia')
  AND 'Garuda Indonesia' IS NOT NULL AND TRIM('Garuda Indonesia') <> '';

-- Create a sequence for auto-incrementing order_index if needed
CREATE SEQUENCE IF NOT EXISTS client_order_index_seq
START WITH 7
INCREMENT BY 1
MINVALUE 7;

-- Function to get next order index
CREATE OR REPLACE FUNCTION get_next_client_order_index()
RETURNS INTEGER AS $$
DECLARE
    next_index INTEGER;
BEGIN
    -- Get the maximum current order_index
    SELECT COALESCE(MAX(order_index), 0) + 1 INTO next_index
    FROM client_content;

    RETURN next_index;
END;
$$ LANGUAGE plpgsql;

-- Reset order_index to be sequential (optional - for cleanup)
DO $$
DECLARE
    client_record RECORD;
    counter INTEGER := 0;
BEGIN
    -- Temporarily disable triggers
    ALTER TABLE client_content DISABLE TRIGGER update_client_content_updated_at;

    -- Update all records with sequential order_index
    FOR client_record IN
        SELECT id FROM client_content ORDER BY COALESCE(order_index, 999999), name
    LOOP
        UPDATE client_content
        SET order_index = counter
        WHERE id = client_record.id;
        counter := counter + 1;
    END LOOP;

    -- Re-enable trigger
    ALTER TABLE client_content ENABLE TRIGGER update_client_content_updated_at;
END $$;

-- Add comment to document the changes
COMMENT ON COLUMN client_content.industry IS 'Industry sector of the client (e.g., Banking, Technology, etc.)';
COMMENT ON COLUMN client_content.description IS 'Description of the client relationship and services provided';
COMMENT ON COLUMN client_content.order_index IS 'Display order for clients on the website';