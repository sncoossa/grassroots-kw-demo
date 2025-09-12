CREATE TABLE IF NOT EXISTS waitlist_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Add an index for faster lookups on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_emails_email ON waitlist_emails (email);

-- Disable RLS for this table since it's public signup (or enable with proper policies)
ALTER TABLE waitlist_emails DISABLE ROW LEVEL SECURITY;

-- Alternative: If you prefer to enable RLS with proper policies:
-- ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public insert on waitlist_emails" ON waitlist_emails FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow service role access to waitlist_emails" ON waitlist_emails FOR ALL USING (auth.role() = 'service_role');
