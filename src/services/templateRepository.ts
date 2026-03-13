export interface StoredTemplate {
  key: string;
  name: string;
  xml: string;
  prompt: string;
  savedAt: string;
}

interface RemoteTemplate {
  id: string;
  name: string;
  xml: string;
  prompt: string;
  savedAt: string;
}

const LOCAL_STORAGE_PREFIX = 'prompt_template_';

function getApiBaseUrl(): string {
  return import.meta.env.VITE_TEMPLATE_API_URL || 'http://localhost:3030';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Template API failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function listFromLocalStorage(): StoredTemplate[] {
  const templates: StoredTemplate[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(LOCAL_STORAGE_PREFIX)) {
      continue;
    }

    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}') as Omit<StoredTemplate, 'key'>;
      templates.push({
        key,
        name: data.name,
        xml: data.xml,
        prompt: data.prompt,
        savedAt: data.savedAt,
      });
    } catch (error) {
      console.error('Failed to parse local template:', error);
    }
  }

  return templates.sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt));
}

function saveToLocalStorage(data: Omit<StoredTemplate, 'key' | 'savedAt'>): StoredTemplate {
  const key = `${LOCAL_STORAGE_PREFIX}${Date.now()}`;
  const payload = {
    ...data,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(payload));

  return { key, ...payload };
}

export async function listTemplates(): Promise<StoredTemplate[]> {
  try {
    const templates = await request<RemoteTemplate[]>('/api/templates');
    return templates.map((template) => ({
      key: template.id,
      name: template.name,
      xml: template.xml,
      prompt: template.prompt,
      savedAt: template.savedAt,
    }));
  } catch {
    return listFromLocalStorage();
  }
}

export async function saveTemplate(data: Omit<StoredTemplate, 'key' | 'savedAt'>): Promise<StoredTemplate> {
  try {
    const template = await request<RemoteTemplate>('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      key: template.id,
      name: template.name,
      xml: template.xml,
      prompt: template.prompt,
      savedAt: template.savedAt,
    };
  } catch {
    return saveToLocalStorage(data);
  }
}
