-- Simplified database setup without NextAuth adapter
-- Run this in your Supabase SQL editor

-- Drop existing policies if they exist
drop policy if exists "Users can read own profile" on user_profiles;
drop policy if exists "Users can insert own profile" on user_profiles;
drop policy if exists "Users can update own profile" on user_profiles;
drop policy if exists "Users can read own interests" on action_interests;
drop policy if exists "Users can insert own interests" on action_interests;
drop policy if exists "Users can update own interests" on action_interests;
drop policy if exists "Allow all operations on user_profiles" on user_profiles;
drop policy if exists "Allow all operations on action_interests" on action_interests;

-- User profiles table (extended user information)
create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique, -- Using text for Google OAuth user IDs
  pronouns varchar(50),
  phone varchar(20),
  bio text,
  profile_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Action interests table (for users' interest in specific actions)
create table if not exists action_interests (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Using text for Google OAuth user IDs
  action_title varchar(255) not null,
  action_date varchar(100),
  action_time varchar(100),
  action_location text,
  availability text,
  motivation text,
  is_scheduled_event boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists user_profiles_user_id_idx on user_profiles(user_id);
create index if not exists action_interests_user_id_idx on action_interests(user_id);

-- Enable Row Level Security
alter table user_profiles enable row level security;
alter table action_interests enable row level security;

-- Create proper user-scoped RLS policies
-- Note: These policies assume you have proper JWT authentication set up
-- and that the user_id in the tables corresponds to the authenticated user's ID

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

-- Create a function to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
drop trigger if exists update_user_profiles_updated_at on user_profiles;
create trigger update_user_profiles_updated_at before update on user_profiles
  for each row execute procedure update_updated_at_column();
