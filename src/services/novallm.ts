const NOVALLM_API_URL = import.meta.env.VITE_NOVALLM_API_URL || '';
const NOVALLM_API_KEY = import.meta.env.VITE_NOVALLM_API_KEY || '';

export interface NovaLLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface NovaLLMResponse {
  response: string;
  executionTime: number;
  success: boolean;
  error?: string;
}

export async function executePrompt(request: NovaLLMRequest): Promise<NovaLLMResponse> {
  const startTime = Date.now();

  if (!NOVALLM_API_URL) {
    return {
      response: `[DEMO MODE]\n\nPrompt已接收：\n${request.prompt}\n\n這是演示模式的回應。請設定 VITE_NOVALLM_API_URL 和 VITE_NOVALLM_API_KEY 環境變數以連接到真實的NovaLLM API。\n\n在實際環境中，這裡會顯示NovaLLM的回應內容。`,
      executionTime: Date.now() - startTime,
      success: true
    };
  }

  try {
    const response = await fetch(NOVALLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NOVALLM_API_KEY}`
      },
      body: JSON.stringify({
        prompt: request.prompt,
        model: request.model || 'default',
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      response: data.response || data.text || data.output || '',
      executionTime: Date.now() - startTime,
      success: true
    };
  } catch (error) {
    return {
      response: '',
      executionTime: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function optimizePrompt(originalPrompt: string): Promise<string> {
  const optimizationRequest: NovaLLMRequest = {
    prompt: `你是一位Prompt Engineering專家。請優化以下提示詞，使其更清晰、更有效：\n\n${originalPrompt}\n\n請直接輸出優化後的提示詞，不要加入其他說明。`,
    temperature: 0.3
  };

  const response = await executePrompt(optimizationRequest);

  if (response.success) {
    return response.response;
  }

  return originalPrompt;
}
