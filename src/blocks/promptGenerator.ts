import * as Blockly from 'blockly';
import { EditableBlockDefinition } from './aiBlocks';

function getEditableBlocks(): EditableBlockDefinition[] {
  try {
    return JSON.parse(localStorage.getItem('editable_blocks') || '[]');
  } catch {
    return [];
  }
}

export function initPromptGenerator() {
  const promptGenerator = new Blockly.Generator('Prompt');
  const ORDER = 0;

  promptGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
      return `${code}\n\n${promptGenerator.blockToCode(nextBlock)}`;
    }
    return code;
  };

  promptGenerator.forBlock['text'] = function(block) {
    return [block.getFieldValue('TEXT') || '', ORDER];
  };

  promptGenerator.forBlock['text_join'] = function(block) {
    const itemCount = (block as Blockly.Block & { itemCount_?: number }).itemCount_ || 0;
    const joined: string[] = [];

    for (let i = 0; i < itemCount; i++) {
      const value = promptGenerator.valueToCode(block, `ADD${i}`, ORDER);
      if (value) joined.push(value);
    }

    return [joined.join(''), ORDER];
  };

  promptGenerator.forBlock['ai_persona'] = function(block) {
    const role = block.getFieldValue('ROLE');
    const expertisePreset = block.getFieldValue('EXPERTISE_PRESET');
    const expertiseCustom = block.getFieldValue('EXPERTISE_CUSTOM');
    const tone = block.getFieldValue('TONE');

    let expertise = '';
    if (expertisePreset === 'custom') expertise = expertiseCustom;
    else if (expertisePreset && expertisePreset !== 'custom') expertise = expertisePreset;

    let prompt = `你是${role}`;
    if (expertise) prompt += `，擅長${expertise}`;

    const toneMap: Record<string, string> = {
      professional: '請使用專業嚴謹的語氣',
      friendly: '請使用親切友善的語氣',
      concise: '請使用簡潔直接的語氣',
    };

    if (toneMap[tone]) prompt += `。${toneMap[tone]}。`;
    return prompt;
  };

  promptGenerator.forBlock['ai_task'] = function(block) {
    const taskInput = promptGenerator.valueToCode(block, 'TASK_INPUT', ORDER);
    const taskDescription = promptGenerator.valueToCode(block, 'TASK_DESCRIPTION', ORDER);

    let prompt = '請協助完成以下任務：';
    if (taskInput) prompt += `\n${taskInput}`;
    if (taskDescription) prompt += `\n\n詳細說明：\n${taskDescription}`;
    return prompt;
  };

  promptGenerator.forBlock['ai_context'] = function(block) {
    const context = promptGenerator.valueToCode(block, 'CONTEXT', ORDER);
    return context ? `情境/輸入資料：\n${context}` : '';
  };

  promptGenerator.forBlock['ai_attachment'] = function(block) {
    const sourceType = block.getFieldValue('SOURCE_TYPE');
    const attachment = promptGenerator.valueToCode(block, 'ATTACHMENT', ORDER);
    if (!attachment) return '';

    const labelMap: Record<string, string> = {
      url: '多媒體位址',
      file: '本機檔案',
      drop: '拖拉上傳',
    };

    return `附件（${labelMap[sourceType] || sourceType}）：\n${attachment}`;
  };

  promptGenerator.forBlock['ai_knowledge_base'] = function(block) {
    const kbId = block.getFieldValue('KB_ID');
    return `請優先使用知識庫資料：${kbId}`;
  };

  promptGenerator.forBlock['ai_constraint'] = function(block) {
    const useBullets = block.getFieldValue('USE_BULLETS') === 'TRUE';
    const noMarketing = block.getFieldValue('NO_MARKETING') === 'TRUE';
    const maxWords = parseInt(block.getFieldValue('MAX_WORDS') || '0');
    const language = block.getFieldValue('LANGUAGE');

    const constraints: string[] = [];
    if (useBullets) constraints.push('- 使用條列式呈現');
    if (noMarketing) constraints.push('- 不使用行銷語言');
    if (maxWords > 0) constraints.push(`- 字數不超過${maxWords}字`);

    const languageMap: Record<string, string> = { 'zh-TW': '繁體中文', 'zh-CN': '簡體中文', en: 'English' };
    if (languageMap[language]) constraints.push(`- 使用${languageMap[language]}`);

    return constraints.length > 0 ? `請遵守以下限制條件：\n${constraints.join('\n')}` : '';
  };

  promptGenerator.forBlock['ai_output_format'] = function(block) {
    const formatMap: Record<string, string> = {
      structured: '請以下列格式輸出：\n- 標題\n- 重點摘要\n- 行動建議',
      json: '請以JSON格式輸出',
      markdown: '請以Markdown格式輸出',
      table: '請以表格格式輸出',
      plain: '請以純文字格式輸出',
    };

    return formatMap[block.getFieldValue('FORMAT')] || '';
  };

  promptGenerator.forBlock['ai_optimizer'] = function(block) {
    const originalPrompt = promptGenerator.valueToCode(block, 'ORIGINAL_PROMPT', ORDER);
    const autoOptimize = block.getFieldValue('AUTO_OPTIMIZE') === 'TRUE';
    return autoOptimize && originalPrompt ? `[OPTIMIZER] ${originalPrompt}` : originalPrompt || '';
  };

  promptGenerator.forBlock['text_multiline'] = function(block) {
    return [block.getFieldValue('TEXT'), ORDER];
  };

  promptGenerator.forBlock['ai_variable_input'] = function(block) {
    return [`{${block.getFieldValue('VAR_NAME')}}`, ORDER];
  };

  getEditableBlocks().forEach((definition) => {
    promptGenerator.forBlock[`editable_${definition.id}`] = function(block) {
      const content = promptGenerator.valueToCode(block, 'CONTENT', ORDER);
      return content ? `${definition.name}：${content}` : `${definition.name}`;
    };
  });

  return promptGenerator;
}

export function generatePromptFromWorkspace(workspace: Blockly.WorkspaceSvg): string {
  const generator = initPromptGenerator();
  const topBlocks = workspace.getTopBlocks(true);

  const prompts = topBlocks.map((block) => {
    const code = generator.blockToCode(block);
    return Array.isArray(code) ? code[0] : code;
  }).filter((code) => code && code.toString().trim() !== '');

  return prompts.join('\n\n');
}
