-- Debug script to check storage setup
-- Run this in your Supabase SQL editor to debug storage issues

-- Check if the profile-images bucket exists
SELECT 
  id, 
  name, 
  public, 
  created_at 
FROM storage.buckets 
WHERE id = 'profile-images';

-- Check storage policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Check if RLS is enabled on storage.objects
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Test basic storage access (this should work if storage is properly configured)
-- You can uncomment this to test:
-- SELECT * FROM storage.buckets LIMIT 1;
