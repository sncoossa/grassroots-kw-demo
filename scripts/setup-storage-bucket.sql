-- Setup Supabase Storage for Profile Images (Safe to run multiple times)
-- Run this in your Supabase SQL editor

-- Step 1: Clean up any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public profile images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete profile images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads to profile images (DEV ONLY)" ON storage.objects;
DROP POLICY IF EXISTS "Allow all updates to profile images (DEV ONLY)" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes to profile images (DEV ONLY)" ON storage.objects;

-- Additional cleanup for any variations that might exist
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;

-- Step 2: Create the profile-images storage bucket (safe with ON CONFLICT)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create new storage policies for NextAuth compatibility
-- IMPORTANT: For NextAuth integration, we need simpler policies
-- Since NextAuth doesn't integrate with Supabase Auth directly,
-- we'll use more permissive policies and rely on application-level security

-- Allow authenticated users to upload profile images
-- (NextAuth users will be authenticated but won't have auth.uid())
CREATE POLICY "Authenticated users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update profile images
CREATE POLICY "Authenticated users can update profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images'
  AND auth.role() = 'authenticated'
) WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete profile images
CREATE POLICY "Authenticated users can delete profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images'
  AND auth.role() = 'authenticated'
);

-- Anyone can view profile images (they're public)
CREATE POLICY "Public can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

-- Step 4: Verify setup (optional - uncomment to test)
-- SELECT 'Storage bucket created successfully!' as status;
-- SELECT id, name, public FROM storage.buckets WHERE id = 'profile-images';

-- Alternative: For development/testing, you can use completely open policies
-- Only use these if you're having auth issues during development:
-- Uncomment the section below if needed:

/*
-- DEVELOPMENT ONLY - Remove these in production!
DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete profile images" ON storage.objects;

CREATE POLICY "Allow all uploads to profile images (DEV ONLY)" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow all updates to profile images (DEV ONLY)" ON storage.objects
FOR UPDATE USING (bucket_id = 'profile-images') WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow all deletes to profile images (DEV ONLY)" ON storage.objects
FOR DELETE USING (bucket_id = 'profile-images');

SELECT 'DEV ONLY policies enabled - REMOVE IN PRODUCTION!' as warning;
*/
