-- Migration: Add colors column to hero_content table
-- This script adds color customization support for hero sections

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

        RAISE NOTICE 'Added colors column to hero_content table with default values';
    ELSE
        RAISE NOTICE 'colors column already exists in hero_content table';
    END IF;
END $$;

-- Verify the column was added successfully
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name='hero_content' AND column_name='colors';