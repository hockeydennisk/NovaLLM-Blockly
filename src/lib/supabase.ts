import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  workspace_xml: string;
  generated_prompt: string;
  category: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CustomBlock {
  id: string;
  block_type: 'persona' | 'task' | 'constraint' | 'output' | 'optimizer' | 'context';
  name: string;
  prompt_template: string;
  icon: string;
  color: string;
  inputs: Array<{
    name: string;
    type: string;
    default?: string;
  }>;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExecutionHistory {
  id: string;
  template_id: string;
  prompt: string;
  response: string;
  execution_time: number;
  success: boolean;
  created_by: string;
  created_at: string;
}
