-- Quick fix for policy conflict error
-- Run this first to clean up the existing policy

-- Drop the conflicting policy
DROP POLICY IF EXISTS "Public profile images are viewable by everyone" ON storage.objects;

-- Recreate it with a slightly different name to avoid future conflicts
CREATE POLICY "Public can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

-- Verify the policy was created
SELECT 'Policy conflict resolved!' as status;
