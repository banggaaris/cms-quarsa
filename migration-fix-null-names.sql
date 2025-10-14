-- Fix null values in client_content name column
-- This migration addresses the NOT NULL constraint violation

-- First, identify any records with null names
DO $$
DECLARE
    null_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO null_count
    FROM client_content
    WHERE name IS NULL OR name = '' OR TRIM(name) = '';

    RAISE NOTICE 'Found % records with null/empty names', null_count;
END $$;

-- Option 1: Delete records with null/empty names (Recommended if these are test/incomplete records)
DELETE FROM client_content
WHERE name IS NULL OR name = '' OR TRIM(name) = '';

-- Option 2: Update null names with placeholder values (Alternative to deletion)
-- Uncomment the following if you prefer to update rather than delete:
/*
UPDATE client_content
SET name = 'Unnamed Client ' || EXTRACT(EPOCH FROM created_at)
WHERE name IS NULL OR name = '' OR TRIM(name) = '';
*/

-- Ensure all records have valid names
ALTER TABLE client_content
ADD CONSTRAINT client_content_name_check
CHECK (name IS NOT NULL AND TRIM(name) <> '');

-- Re-sequence order_index to ensure no gaps after deletion
DO $$
DECLARE
    client_record RECORD;
    counter INTEGER := 0;
BEGIN
    -- Temporarily disable trigger
    ALTER TABLE client_content DISABLE TRIGGER update_client_content_updated_at;

    -- Update all records with sequential order_index
    FOR client_record IN
        SELECT id FROM client_content ORDER BY COALESCE(order_index, 999999), created_at
    LOOP
        UPDATE client_content
        SET order_index = counter
        WHERE id = client_record.id;
        counter := counter + 1;
    END LOOP;

    -- Re-enable trigger
    ALTER TABLE client_content ENABLE TRIGGER update_client_content_updated_at;
END $$;

-- Verify no null names remain
DO $$
DECLARE
    null_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO null_count
    FROM client_content
    WHERE name IS NULL OR name = '' OR TRIM(name) = '';

    IF null_count > 0 THEN
        RAISE EXCEPTION 'Still found % records with null/empty names after fix!', null_count;
    ELSE
        RAISE NOTICE 'Successfully fixed all null name issues';
    END IF;
END $$;

-- Show current client data for verification
SELECT
    id,
    name,
    industry,
    description,
    logo_url,
    order_index,
    created_at
FROM client_content
ORDER BY order_index, created_at;