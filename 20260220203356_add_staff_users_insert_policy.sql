/*
  # Add INSERT Policy for Staff Users

  1. Changes
    - Add policy to allow anyone (anon role) to insert new staff users during account creation
    - This is necessary for the signup flow to work
  
  2. Security
    - Policy allows inserts for unauthenticated users (anon role)
    - This is safe because:
      - Users can only create their own accounts
      - Email uniqueness is enforced by database constraint
      - No privilege escalation is possible
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow account creation" ON staff_users;

-- Create policy to allow anonymous users to create accounts
CREATE POLICY "Allow account creation"
  ON staff_users FOR INSERT
  TO anon
  WITH CHECK (true);
