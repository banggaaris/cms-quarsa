-- Create gallery_content table
CREATE TABLE IF NOT EXISTS gallery_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for gallery_content
CREATE TRIGGER update_gallery_content_updated_at
  BEFORE UPDATE ON gallery_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample gallery data if table is empty
INSERT INTO gallery_content (title, description, category, image_url, order_index)
SELECT
  'Office Headquarters',
  'Our modern office space in Jakarta Stock Exchange Building',
  'office',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  0
FROM (SELECT 1) AS dummy WHERE NOT EXISTS (SELECT 1 FROM gallery_content) LIMIT 1;

INSERT INTO gallery_content (title, description, category, image_url, order_index)
SELECT
  'Team Meeting',
  'Our team collaborating on strategic investment planning',
  'team',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
  1
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM gallery_content) = 1;

INSERT INTO gallery_content (title, description, category, image_url, order_index)
SELECT
  'Conference Room',
  'State-of-the-art conference facilities for client meetings',
  'office',
  'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=600&fit=crop',
  2
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM gallery_content) = 2;

INSERT INTO gallery_content (title, description, category, image_url, order_index)
SELECT
  'Client Presentation',
  'Presenting investment strategies to our valued clients',
  'business',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  3
FROM (SELECT 1) AS dummy WHERE (SELECT COUNT(*) FROM gallery_content) = 3;

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_content ENABLE ROW LEVEL SECURITY;

-- Policies for public and authenticated users
CREATE POLICY "Public can view gallery content" ON gallery_content FOR SELECT USING (true);
CREATE POLICY "Users can update gallery content" ON gallery_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert gallery content" ON gallery_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete gallery content" ON gallery_content FOR DELETE USING (auth.role() = 'authenticated');