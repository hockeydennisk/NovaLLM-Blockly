import * as Blockly from 'blockly';

export function initPromptGenerator() {
  const promptGenerator = new Blockly.Generator('Prompt');

  promptGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
      return code + '\n\n' + promptGenerator.blockToCode(nextBlock);
    }
    return code;
  };

  promptGenerator.forBlock['ai_persona'] = function(block) {
    const role = block.getFieldValue('ROLE');
    const expertise = block.getFieldValue('EXPERTISE');
    const tone = block.getFieldValue('TONE');

    let prompt = `你是${role}`;
    if (expertise) {
      prompt += `，擅長${expertise}`;
    }

    const toneMap: Record<string, string> = {
      'professional': '請使用專業嚴謹的語氣',
      'friendly': '請使用親切友善的語氣',
      'concise': '請使用簡潔直接的語氣'
    };

    if (toneMap[tone]) {
      prompt += `。${toneMap[tone]}。`;
    }

    return prompt;
  };

  promptGenerator.forBlock['ai_task'] = function(block) {
    const taskInput = promptGenerator.valueToCode(block, 'TASK_INPUT', promptGenerator.ORDER_ATOMIC);
    const taskDescription = promptGenerator.statementToCode(block, 'TASK_DESCRIPTION');

    let prompt = '請協助完成以下任務：';
    if (taskInput) {
      prompt += `\n${taskInput}`;
    }
    if (taskDescription) {
      prompt += `\n\n詳細說明：\n${taskDescription}`;
    }

    return prompt;
  };

  promptGenerator.forBlock['ai_context'] = function(block) {
    const context = promptGenerator.valueToCode(block, 'CONTEXT', promptGenerator.ORDER_ATOMIC);
    if (context) {
      return `情境/輸入資料：\n${context}`;
    }
    return '';
  };

  promptGenerator.forBlock['ai_constraint'] = function(block) {
    const useBullets = block.getFieldValue('USE_BULLETS') === 'TRUE';
    const noMarketing = block.getFieldValue('NO_MARKETING') === 'TRUE';
    const maxWords = parseInt(block.getFieldValue('MAX_WORDS') || '0');
    const language = block.getFieldValue('LANGUAGE');

    const constraints: string[] = [];

    if (useBullets) {
      constraints.push('- 使用條列式呈現');
    }
    if (noMarketing) {
      constraints.push('- 不使用行銷語言');
    }
    if (maxWords > 0) {
      constraints.push(`- 字數不超過${maxWords}字`);
    }

    const languageMap: Record<string, string> = {
      'zh-TW': '繁體中文',
      'zh-CN': '簡體中文',
      'en': 'English'
    };

    if (languageMap[language]) {
      constraints.push(`- 使用${languageMap[language]}`);
    }

    if (constraints.length > 0) {
      return `請遵守以下限制條件：\n${constraints.join('\n')}`;
    }
    return '';
  };

  promptGenerator.forBlock['ai_output_format'] = function(block) {
    const format = block.getFieldValue('FORMAT');

    const formatMap: Record<string, string> = {
      'structured': '請以下列格式輸出：\n- 標題\n- 重點摘要\n- 行動建議',
      'json': '請以JSON格式輸出',
      'markdown': '請以Markdown格式輸出',
      'table': '請以表格格式輸出',
      'plain': '請以純文字格式輸出'
    };

    return formatMap[format] || '';
  };

  promptGenerator.forBlock['ai_optimizer'] = function(block) {
    const originalPrompt = promptGenerator.valueToCode(block, 'ORIGINAL_PROMPT', promptGenerator.ORDER_ATOMIC);
    const autoOptimize = block.getFieldValue('AUTO_OPTIMIZE') === 'TRUE';

    if (autoOptimize && originalPrompt) {
      return `[OPTIMIZER] ${originalPrompt}`;
    }
    return originalPrompt || '';
  };

  promptGenerator.forBlock['text_multiline'] = function(block) {
    const text = block.getFieldValue('TEXT');
    return [text, promptGenerator.ORDER_ATOMIC];
  };

  promptGenerator.forBlock['ai_variable_input'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    return [`{${varName}}`, promptGenerator.ORDER_ATOMIC];
  };

  return promptGenerator;
}

export function generatePromptFromWorkspace(workspace: Blockly.WorkspaceSvg): string {
  const generator = initPromptGenerator();
  const topBlocks = workspace.getTopBlocks(true);

  const prompts = topBlocks.map(block => {
    return generator.blockToCode(block);
  }).filter(code => code.trim() !== '');

  return prompts.join('\n\n');
}
