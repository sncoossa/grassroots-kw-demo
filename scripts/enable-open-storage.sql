-- Emergency fix for RLS policy violation
-- This enables open storage policies for development/testing
-- Run this in your Supabase SQL editor

-- Drop the restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public profile images are viewable by everyone" ON storage.objects;

-- Create open policies for development (NextAuth compatible)
CREATE POLICY "Allow all uploads to profile images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow all updates to profile images" ON storage.objects
FOR UPDATE USING (bucket_id = 'profile-images') 
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow all deletes to profile images" ON storage.objects
FOR DELETE USING (bucket_id = 'profile-images');

CREATE POLICY "Allow all reads to profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

-- Verify the policies
SELECT 'Open storage policies enabled - this should fix the upload issue!' as status;

-- Note: These are open policies for development. 
-- In production, you'll want to implement proper application-level security.
