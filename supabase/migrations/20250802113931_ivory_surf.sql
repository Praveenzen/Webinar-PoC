/*
  # Add user_type column to user_profiles table

  1. Changes
    - Add `user_type` column to `user_profiles` table with values 'public' or 'paid'
    - Set default value to 'public' for existing users
    - Add check constraint to ensure only valid values

  2. Security
    - No changes to existing RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN user_type text NOT NULL DEFAULT 'public' CHECK (user_type IN ('public', 'paid'));
  END IF;
END $$;