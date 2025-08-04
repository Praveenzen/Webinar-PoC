/*
  # Fix RLS policies for user profile creation during signup

  1. Security Updates
    - Drop existing policies that might be conflicting
    - Create proper INSERT policy for authenticated users during signup
    - Ensure users can create their own profiles
    - Update SELECT and UPDATE policies for consistency

  2. Policy Changes
    - Allow authenticated users to insert their own profile
    - Allow users to read their own profile
    - Allow users to update their own profile
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for authenticated users to create their own profile
CREATE POLICY "Enable insert for authenticated users own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create SELECT policy for users to read their own profile
CREATE POLICY "Enable select for users own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create UPDATE policy for users to update their own profile
CREATE POLICY "Enable update for users own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);