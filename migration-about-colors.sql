-- Migration for About Section Color Customization
-- This migration adds color fields to customize the gradient background in the About section

-- Add color columns to about_content table
ALTER TABLE about_content
ADD COLUMN IF NOT EXISTS gradient_from_color text DEFAULT '#0c4a6e',
ADD COLUMN IF NOT EXISTS gradient_to_color text DEFAULT '#111827';

-- Update existing about content with default colors if null
UPDATE about_content
SET
    gradient_from_color = '#0c4a6e',
    gradient_to_color = '#111827'
WHERE gradient_from_color IS NULL OR gradient_to_color IS NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN about_content.gradient_from_color IS 'Starting color for the gradient background in the About section (e.g., #0c4a6e for sky-900)';
COMMENT ON COLUMN about_content.gradient_to_color IS 'Ending color for the gradient background in the About section (e.g., #111827 for gray-900)';

-- Verification query to show current about data with color settings
SELECT
    id,
    title,
    gradient_from_color,
    gradient_to_color,
    updated_at
FROM about_content;