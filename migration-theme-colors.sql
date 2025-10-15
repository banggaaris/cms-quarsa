-- =====================================================
-- MIGRATION: Add Theme Colors to Company Settings
-- =====================================================
-- RUN THIS MIGRATION IN SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
-- This migration is safe to run multiple times

-- Add theme colors columns to company_settings table (if they don't exist)
DO $$
BEGIN
    -- Add primary_button_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'primary_button_color') THEN
        ALTER TABLE company_settings ADD COLUMN primary_button_color TEXT;
    END IF;

    -- Add primary_button_hover_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'primary_button_hover_color') THEN
        ALTER TABLE company_settings ADD COLUMN primary_button_hover_color TEXT;
    END IF;

    -- Add secondary_button_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'secondary_button_color') THEN
        ALTER TABLE company_settings ADD COLUMN secondary_button_color TEXT;
    END IF;

    -- Add secondary_button_hover_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'secondary_button_hover_color') THEN
        ALTER TABLE company_settings ADD COLUMN secondary_button_hover_color TEXT;
    END IF;

    -- Add badge_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'badge_color') THEN
        ALTER TABLE company_settings ADD COLUMN badge_color TEXT;
    END IF;

    -- Add badge_hover_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'badge_hover_color') THEN
        ALTER TABLE company_settings ADD COLUMN badge_hover_color TEXT;
    END IF;

    -- Add section_title_badge_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'section_title_badge_color') THEN
        ALTER TABLE company_settings ADD COLUMN section_title_badge_color TEXT;
    END IF;

    -- Add section_title_badge_hover_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'section_title_badge_hover_color') THEN
        ALTER TABLE company_settings ADD COLUMN section_title_badge_hover_color TEXT;
    END IF;

    -- Add footer_background_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'footer_background_color') THEN
        ALTER TABLE company_settings ADD COLUMN footer_background_color TEXT;
    END IF;

    -- Add footer_text_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'footer_text_color') THEN
        ALTER TABLE company_settings ADD COLUMN footer_text_color TEXT;
    END IF;

    -- Add footer_link_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'footer_link_color') THEN
        ALTER TABLE company_settings ADD COLUMN footer_link_color TEXT;
    END IF;

    -- Add footer_link_hover_color if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'company_settings' AND column_name = 'footer_link_hover_color') THEN
        ALTER TABLE company_settings ADD COLUMN footer_link_hover_color TEXT;
    END IF;
END $$;

-- Update existing records with default values (only if NULL)
UPDATE company_settings
SET
    primary_button_color = COALESCE(primary_button_color, '#0EA5E9'),
    primary_button_hover_color = COALESCE(primary_button_hover_color, '#0284C7'),
    secondary_button_color = COALESCE(secondary_button_color, '#64748B'),
    secondary_button_hover_color = COALESCE(secondary_button_hover_color, '#475569'),
    badge_color = COALESCE(badge_color, '#3B82F6'),
    badge_hover_color = COALESCE(badge_hover_color, '#2563EB'),
    section_title_badge_color = COALESCE(section_title_badge_color, '#10B981'),
    section_title_badge_hover_color = COALESCE(section_title_badge_hover_color, '#059669'),
    footer_background_color = COALESCE(footer_background_color, '#1F2937'),
    footer_text_color = COALESCE(footer_text_color, '#F9FAFB'),
    footer_link_color = COALESCE(footer_link_color, '#D1D5DB'),
    footer_link_hover_color = COALESCE(footer_link_hover_color, '#F9FAFB')
WHERE
    primary_button_color IS NULL
    OR primary_button_hover_color IS NULL
    OR secondary_button_color IS NULL
    OR secondary_button_hover_color IS NULL
    OR badge_color IS NULL
    OR badge_hover_color IS NULL
    OR section_title_badge_color IS NULL
    OR section_title_badge_hover_color IS NULL
    OR footer_background_color IS NULL
    OR footer_text_color IS NULL
    OR footer_link_color IS NULL
    OR footer_link_hover_color IS NULL;

-- =====================================================
-- VERIFICATION QUERY (Optional)
-- =====================================================
-- Run this to verify the columns were added successfully:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'company_settings' AND column_name LIKE '%color%';