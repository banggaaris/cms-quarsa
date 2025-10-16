-- Migration: Add hero_slides table for photo slider functionality
-- This table will store individual slides for the hero section photo slider

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default hero slides if table is empty
INSERT INTO hero_slides (title, description, image_url, order_index, status)
SELECT
  'Investment Strategy',
  'Data-driven investment solutions for optimal portfolio performance',
  'https://picsum.photos/800/500?random=1&blur=2',
  0,
  'published'
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM hero_slides) LIMIT 1;

INSERT INTO hero_slides (title, description, image_url, order_index, status)
SELECT
  'Risk Management',
  'Comprehensive risk assessment and mitigation strategies',
  'https://picsum.photos/800/500?random=2&blur=2',
  1,
  'published'
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM hero_slides) = 1;

INSERT INTO hero_slides (title, description, image_url, order_index, status)
SELECT
  'Expert Advisory',
  'Seasoned financial professionals guiding your success',
  'https://picsum.photos/800/500?random=3&blur=2',
  2,
  'published'
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM hero_slides) = 2;

INSERT INTO hero_slides (title, description, image_url, order_index, status)
SELECT
  'Market Analysis',
  'Deep market insights and trend analysis for informed decisions',
  'https://picsum.photos/800/500?random=4&blur=2',
  3,
  'published'
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM hero_slides) = 3;

INSERT INTO hero_slides (title, description, image_url, order_index, status)
SELECT
  'Financial Growth',
  'Strategic planning for sustainable business growth',
  'https://picsum.photos/800/500?random=5&blur=2',
  4,
  'published'
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM hero_slides) = 4;

-- Enable Row Level Security (RLS)
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies to allow authenticated users to manage hero slides
CREATE POLICY "Users can view all hero slides" ON hero_slides FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update hero slides" ON hero_slides FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert hero slides" ON hero_slides FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete hero slides" ON hero_slides FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_slides_status ON hero_slides(status);