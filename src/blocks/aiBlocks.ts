import * as Blockly from 'blockly';

export function initAIBlocks() {
  Blockly.Blocks['ai_persona'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('🎭 Persona:')
        .appendField(new Blockly.FieldTextInput('資深程式專家'), 'ROLE');
      this.appendDummyInput()
        .appendField('專長領域:')
        .appendField(new Blockly.FieldTextInput(''), 'EXPERTISE');
      this.appendDummyInput()
        .appendField('語氣:')
        .appendField(new Blockly.FieldDropdown([
          ['專業嚴謹', 'professional'],
          ['親切友善', 'friendly'],
          ['簡潔直接', 'concise']
        ]), 'TONE');
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('定義AI的角色與專業');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ai_task'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('📋 任務:');
      this.appendValueInput('TASK_INPUT')
        .setCheck(null)
        .appendField('');
      this.appendStatementInput('TASK_DESCRIPTION')
        .setCheck(null)
        .appendField('詳細說明:');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('定義要完成的任務');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ai_context'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('📝 情境/輸入資料:');
      this.appendValueInput('CONTEXT')
        .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip('提供情境或輸入資料');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ai_constraint'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('⚠️ 限制條件:');
      this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'USE_BULLETS')
        .appendField('使用條列式');
      this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'NO_MARKETING')
        .appendField('不使用行銷語');
      this.appendDummyInput()
        .appendField('字數限制:')
        .appendField(new Blockly.FieldNumber(0, 0, 10000), 'MAX_WORDS');
      this.appendDummyInput()
        .appendField('語言:')
        .appendField(new Blockly.FieldDropdown([
          ['繁體中文', 'zh-TW'],
          ['簡體中文', 'zh-CN'],
          ['English', 'en']
        ]), 'LANGUAGE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip('設定輸出限制條件');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ai_output_format'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('📤 輸出格式:')
        .appendField(new Blockly.FieldDropdown([
          ['標題+摘要+建議', 'structured'],
          ['JSON', 'json'],
          ['Markdown', 'markdown'],
          ['表格', 'table'],
          ['純文字', 'plain']
        ]), 'FORMAT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip('指定輸出格式');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ai_optimizer'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('✨ Prompt優化器');
      this.appendValueInput('ORIGINAL_PROMPT')
        .setCheck(null)
        .appendField('原始Prompt:');
      this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'AUTO_OPTIMIZE')
        .appendField('自動優化');
      this.setOutput(true, null);
      this.setColour(45);
      this.setTooltip('使用AI優化你的Prompt');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['text_multiline'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('輸入文字'), 'TEXT');
      this.setOutput(true, 'String');
      this.setColour(160);
      this.setTooltip('文字輸入');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['ai_variable_input'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('變數:')
        .appendField(new Blockly.FieldTextInput('變數名稱'), 'VAR_NAME');
      this.setOutput(true, null);
      this.setColour(330);
      this.setTooltip('引用變數');
      this.setHelpUrl('');
    }
  };
}
