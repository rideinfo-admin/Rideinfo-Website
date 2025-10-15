/*
  # Create Feedback Table
  
  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - User who submitted feedback
      - `message` (text, required) - Feedback message
      - `rating` (integer) - Rating from 1-5
      - `created_at` (timestamptz) - Timestamp of creation
      
  2. Security
    - Enable RLS on feedback table
    - Users can insert their own feedback
    - Users can view their own feedback
    
  3. Important Notes
    - Feedback helps improve the application
    - All timestamps use `now()` as default
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  rating integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback(user_id);
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback(created_at DESC);