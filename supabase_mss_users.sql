-- mss_users: links Supabase auth users to gb_clients tenants
CREATE TABLE IF NOT EXISTS mss_users (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id    text NOT NULL,  -- matches gb_clients.client_id
  role         text NOT NULL DEFAULT 'owner',
  created_at   timestamptz DEFAULT now()
);

-- RLS: users can only see their own row
ALTER TABLE mss_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mss_users_self" ON mss_users
  FOR ALL USING (auth.uid() = id);
