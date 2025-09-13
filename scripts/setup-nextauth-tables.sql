-- NextAuth.js required tables for Supabase adapter
-- Run this in your Supabase SQL editor

-- Create auth schema tables
create table if not exists accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  type varchar(255) not null,
  provider varchar(255) not null,
  provider_account_id varchar(255) not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  id_token text,
  scope text,
  session_state text,
  token_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  expires timestamp with time zone not null,
  session_token varchar(255) not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  name varchar(255),
  email varchar(255) unique,
  email_verified timestamp with time zone,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists verification_tokens (
  identifier text not null,
  expires timestamp with time zone not null,
  token text not null,
  
  primary key (identifier, token)
);

-- User profiles table (extended user information)
create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references users(id) on delete cascade,
  pronouns varchar(50),
  phone varchar(20),
  bio text,
  profile_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id)
);

-- Action interests table (for users' interest in specific actions)
create table if not exists action_interests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
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
create index if not exists accounts_user_id_idx on accounts(user_id);
create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists sessions_session_token_idx on sessions(session_token);
create index if not exists user_profiles_user_id_idx on user_profiles(user_id);
create index if not exists action_interests_user_id_idx on action_interests(user_id);

-- Add foreign key constraints
alter table accounts add constraint accounts_user_id_fkey foreign key (user_id) references users(id) on delete cascade;
alter table sessions add constraint sessions_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

-- Enable Row Level Security
alter table users enable row level security;
alter table user_profiles enable row level security;
alter table action_interests enable row level security;

-- Create RLS policies
-- Users can read their own data
create policy "Users can read own data" on users for select using (auth.uid() = id);
create policy "Users can update own data" on users for update using (auth.uid() = id);

-- User profiles policies
create policy "Users can read own profile" on user_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on user_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on user_profiles for update using (auth.uid() = user_id);

-- Action interests policies
create policy "Users can read own interests" on action_interests for select using (auth.uid() = user_id);
create policy "Users can insert own interests" on action_interests for insert with check (auth.uid() = user_id);
create policy "Users can update own interests" on action_interests for update using (auth.uid() = user_id);

-- Create a function to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
create trigger update_users_updated_at before update on users
  for each row execute procedure update_updated_at_column();

create trigger update_accounts_updated_at before update on accounts
  for each row execute procedure update_updated_at_column();

create trigger update_sessions_updated_at before update on sessions
  for each row execute procedure update_updated_at_column();

create trigger update_user_profiles_updated_at before update on user_profiles
  for each row execute procedure update_updated_at_column();
