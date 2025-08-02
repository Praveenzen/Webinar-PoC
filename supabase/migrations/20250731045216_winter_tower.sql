/*
  # Create webinars table

  1. New Tables
    - `webinars`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `scheduled_date` (timestamp)
      - `duration_minutes` (integer)
      - `speaker_name` (text)
      - `embed_url` (text)
      - `access_type` (text) - either 'public' or 'paid_only'
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `webinars` table
    - Add policy for contributors to manage their webinars
    - Add policy for users to read public webinars
*/

CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  speaker_name text NOT NULL,
  embed_url text DEFAULT '',
  access_type text NOT NULL DEFAULT 'public' CHECK (access_type IN ('public', 'paid_only')),
  created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributors can manage own webinars"
  ON webinars
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Anyone can read public webinars"
  ON webinars
  FOR SELECT
  TO authenticated, anon
  USING (access_type = 'public');

CREATE POLICY "Authenticated users can read all webinars"
  ON webinars
  FOR SELECT
  TO authenticated
  USING (true);