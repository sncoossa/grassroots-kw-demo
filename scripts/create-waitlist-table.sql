CREATE TABLE IF NOT EXISTS waitlist_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Add an index for faster lookups on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_emails_email ON waitlist_emails (email);
