-- SQL Script untuk memperbarui service_content agar menggunakan order_list
-- dan memigrasi data dari order_index ke order_list

-- Rename order_index menjadi order_list untuk konsistensi
ALTER TABLE service_content RENAME COLUMN order_index TO order_list;

-- Drop the features column since we're removing it
ALTER TABLE service_content DROP COLUMN IF EXISTS features;

-- Update existing data to ensure proper ordering (if needed)
UPDATE service_content
SET order_list = (
    SELECT row_number - 1
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_number
        FROM service_content
    ) as numbered
    WHERE numbered.id = service_content.id
);

-- Tambahkan komentar pada field yang di-rename
COMMENT ON COLUMN service_content.order_list IS 'Urutan tampilan service di website, dimulai dari 0';