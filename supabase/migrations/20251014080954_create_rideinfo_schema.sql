/*
  # Rideinfo Database Schema
  
  1. New Tables
    - `institutes`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the institute
      - `user_id` (uuid, foreign key) - Owner of the institute
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
    
    - `drivers`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the driver
      - `bus_number` (text, required) - Bus number assigned to driver
      - `institute_id` (uuid, foreign key) - Institute this driver belongs to
      - `user_id` (uuid, foreign key) - Owner of the driver record
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
  
  2. Security
    - Enable RLS on all tables
    - Users can only access their own institutes and drivers
    - Policies for SELECT, INSERT, UPDATE, DELETE operations
    
  3. Important Notes
    - All timestamps use `now()` as default
    - Foreign key constraints ensure data integrity
    - Cascading deletes: when an institute is deleted, all its drivers are deleted
*/

-- Create institutes table
CREATE TABLE IF NOT EXISTS institutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bus_number text NOT NULL,
  institute_id uuid NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on institutes table
ALTER TABLE institutes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on drivers table
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Institutes policies
CREATE POLICY "Users can view own institutes"
  ON institutes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own institutes"
  ON institutes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own institutes"
  ON institutes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own institutes"
  ON institutes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drivers policies
CREATE POLICY "Users can view own drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drivers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drivers"
  ON drivers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS institutes_user_id_idx ON institutes(user_id);
CREATE INDEX IF NOT EXISTS drivers_institute_id_idx ON drivers(institute_id);
CREATE INDEX IF NOT EXISTS drivers_user_id_idx ON drivers(user_id);