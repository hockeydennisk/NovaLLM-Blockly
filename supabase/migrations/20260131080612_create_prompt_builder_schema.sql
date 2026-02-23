/*
  # Visual Prompt Engineering Platform Schema

  1. New Tables
    - `prompt_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name
      - `description` (text) - Template description
      - `workspace_xml` (text) - Blockly workspace XML
      - `generated_prompt` (text) - Last generated prompt text
      - `category` (text) - Template category
      - `is_public` (boolean) - Whether template is shared publicly
      - `created_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `custom_blocks`
      - `id` (uuid, primary key)
      - `block_type` (text) - persona, task, constraint, output, optimizer, context
      - `name` (text) - Block display name
      - `prompt_template` (text) - The prompt text template
      - `icon` (text) - Icon name or URL
      - `color` (text) - Block color
      - `inputs` (jsonb) - Input configuration
      - `is_public` (boolean) - Whether block is shared publicly
      - `created_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `execution_history`
      - `id` (uuid, primary key)
      - `template_id` (uuid, foreign key to prompt_templates)
      - `prompt` (text) - The prompt sent to API
      - `response` (text) - The API response
      - `execution_time` (integer) - Execution time in ms
      - `success` (boolean) - Whether execution was successful
      - `created_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read their own data and public templates/blocks
    - Users can create, update, delete their own data
    - Public templates and blocks are readable by all authenticated users
*/

-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  workspace_xml text NOT NULL,
  generated_prompt text DEFAULT '',
  category text DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create custom_blocks table
CREATE TABLE IF NOT EXISTS custom_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type text NOT NULL CHECK (block_type IN ('persona', 'task', 'constraint', 'output', 'optimizer', 'context')),
  name text NOT NULL,
  prompt_template text NOT NULL,
  icon text DEFAULT '',
  color text DEFAULT '#5b67a5',
  inputs jsonb DEFAULT '[]'::jsonb,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create execution_history table
CREATE TABLE IF NOT EXISTS execution_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES prompt_templates(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  response text DEFAULT '',
  execution_time integer DEFAULT 0,
  success boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompt_templates
CREATE POLICY "Users can view own templates"
  ON prompt_templates FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own templates"
  ON prompt_templates FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own templates"
  ON prompt_templates FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON prompt_templates FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for custom_blocks
CREATE POLICY "Users can view own and public blocks"
  ON custom_blocks FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own blocks"
  ON custom_blocks FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own blocks"
  ON custom_blocks FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own blocks"
  ON custom_blocks FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for execution_history
CREATE POLICY "Users can view own execution history"
  ON execution_history FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert own execution history"
  ON execution_history FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_templates_created_by ON prompt_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_is_public ON prompt_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_custom_blocks_created_by ON custom_blocks(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_blocks_block_type ON custom_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_execution_history_created_by ON execution_history(created_by);
CREATE INDEX IF NOT EXISTS idx_execution_history_template_id ON execution_history(template_id);