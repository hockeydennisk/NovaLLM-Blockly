import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

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

export interface ConversationSession {
  id: string;
  conversation_id: string;
  last_prompt: string;
  last_result: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

async function getCurrentUserId() {
  if (!isSupabaseEnabled) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

export async function fetchPromptTemplatesFromSupabase(): Promise<PromptTemplate[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch prompt templates from supabase:', error);
    return [];
  }

  return (data || []) as PromptTemplate[];
}

export async function savePromptTemplateToSupabase(payload: {
  name: string;
  description: string;
  workspace_xml: string;
  generated_prompt: string;
  category?: string;
  is_public?: boolean;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase.from('prompt_templates').insert({
    ...payload,
    category: payload.category || 'general',
    is_public: payload.is_public || false,
    created_by: userId,
  });

  if (error) {
    console.error('Failed to save prompt template to supabase:', error);
  }
}

export async function fetchConversationIdsFromSupabase(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('conversation_id')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch conversation ids:', error);
    return [];
  }

  return Array.from(new Set((data || []).map((item) => item.conversation_id)));
}

export async function upsertConversationSessionToSupabase(payload: {
  conversation_id: string;
  last_prompt: string;
  last_result: string;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('conversation_sessions')
    .upsert({
      ...payload,
      created_by: userId,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'conversation_id,created_by',
    });

  if (error) {
    console.error('Failed to upsert conversation session:', error);
  }
}
