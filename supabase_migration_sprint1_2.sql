-- ============================================================
-- NOTIN AJA! — Sprint 1 & 2 Supabase Migration Script
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Sprint 1: Field deskripsi task
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;

-- Sprint 2: Tabel kategori kustom
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_index INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa query per user
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON categories(user_id);

-- RLS (Row Level Security) — user hanya bisa baca/edit kategori miliknya sendiri
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop dulu agar aman jika dijalankan ulang
DROP POLICY IF EXISTS "User dapat melihat kategori mereka sendiri" ON categories;
DROP POLICY IF EXISTS "User dapat membuat kategori sendiri" ON categories;
DROP POLICY IF EXISTS "User dapat menghapus kategori mereka sendiri" ON categories;
DROP POLICY IF EXISTS "User dapat mengupdate kategori mereka sendiri" ON categories;

CREATE POLICY "User dapat melihat kategori mereka sendiri"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User dapat membuat kategori sendiri"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User dapat menghapus kategori mereka sendiri"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "User dapat mengupdate kategori mereka sendiri"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);
