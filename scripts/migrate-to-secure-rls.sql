-- Migration script to upgrade from permissive RLS policies to secure user-scoped policies
-- Run this in your Supabase SQL editor if you already have the old permissive policies

-- ⚠️  IMPORTANT: Test this in a staging environment first!
-- ⚠️  Make sure your authentication is working before applying these policies
-- ⚠️  Users will lose access to data if their authentication doesn't match the user_id

-- Step 1: Drop the old permissive policies
drop policy if exists "Allow all operations on user_profiles" on user_profiles;
drop policy if exists "Allow all operations on action_interests" on action_interests;

-- Step 2: Create secure user-scoped policies
-- Note: These policies work with both Supabase Auth (auth.uid()) and NextAuth (auth.jwt() ->> 'sub')

-- User Profiles Policies: Users can only access their own profile data
create policy "Users can read own profile" on user_profiles 
  for select using (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

create policy "Users can insert own profile" on user_profiles 
  for insert with check (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

create policy "Users can update own profile" on user_profiles 
  for update using (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  ) with check (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

-- Action Interests Policies: Users can only access their own action interests
create policy "Users can read own interests" on action_interests 
  for select using (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

create policy "Users can insert own interests" on action_interests 
  for insert with check (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

create policy "Users can update own interests" on action_interests 
  for update using (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  ) with check (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

-- Optional: Allow users to delete their own data
create policy "Users can delete own profile" on user_profiles 
  for delete using (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

create policy "Users can delete own interests" on action_interests 
  for delete using (
    auth.uid()::text = user_id OR
    auth.jwt() ->> 'sub' = user_id
  );

-- Verification queries to test the policies
-- Uncomment and run these to verify the policies are working:

-- SELECT 'Testing user_profiles access...' as test_name;
-- SELECT * FROM user_profiles LIMIT 1;

-- SELECT 'Testing action_interests access...' as test_name;
-- SELECT * FROM action_interests LIMIT 1;

-- If the above queries work for authenticated users and fail for unauthenticated users,
-- your RLS policies are working correctly!
