-- Create services_section_content table
-- This table stores the main content for the services section (header, subtitle, description)

CREATE TABLE IF NOT EXISTS services_section_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Comprehensive Financial Solutions',
    description TEXT NOT NULL DEFAULT 'We offer a full spectrum of investment advisory services designed to meet the diverse needs of our clients across various industries.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT idx_services_section_content_updated_at ON services_section_content(updated_at);

-- Insert default content if table is empty
INSERT INTO services_section_content (title, description)
VALUES (
    'Comprehensive Financial Solutions',
    'We offer a full spectrum of investment advisory services designed to meet the diverse needs of our clients across various industries.'
)
ON CONFLICT DO NOTHING;

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_section_content_updated_at
    BEFORE UPDATE ON services_section_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();