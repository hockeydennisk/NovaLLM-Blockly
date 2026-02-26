import * as Blockly from 'blockly';

export interface EditableBlockDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CUSTOM_CATEGORY_ID = 'CUSTOM_BLOCKS';

function getEditableBlocks(): EditableBlockDefinition[] {
  try {
    return JSON.parse(localStorage.getItem('editable_blocks') || '[]');
  } catch {
    return [];
  }
}

function registerEditableBlocks() {
  getEditableBlocks().forEach((definition) => {
    const type = `editable_${definition.id}`;
    Blockly.Blocks[type] = {
      init: function() {
        this.appendValueInput('CONTENT').setCheck(null)
          .appendField(`${definition.icon} ${definition.name}`);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(definition.color);
        this.setTooltip(`自訂積木：${definition.name}`);
      }
    };
  });

  if ((globalThis as { __novaCustomRegistered?: boolean }).__novaCustomRegistered) {
    return;
  }

  (globalThis as { __novaCustomRegistered?: boolean }).__novaCustomRegistered = true;
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    CUSTOM_CATEGORY_ID,
    class extends Blockly.ToolboxCategory {
      createFlyoutInfo() {
        const blocks = getEditableBlocks().map((definition) => ({
          kind: 'block',
          type: `editable_${definition.id}`,
        }));

        return {
          kind: 'flyoutToolbox',
          contents: blocks.length > 0
            ? blocks
            : [{
              kind: 'label',
              text: '尚無自訂積木，請先使用「編輯積木」新增',
            }],
        };
      }
    },
    true,
  );
}

export function initAIBlocks() {
  registerEditableBlocks();

  Blockly.Blocks['ai_persona'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('🎭 Persona:')
        .appendField(new Blockly.FieldTextInput('資深程式專家'), 'ROLE');
      this.appendDummyInput()
        .appendField('專長領域:')
        .appendField(new Blockly.FieldDropdown([
          ['Frontend 工程師', 'Frontend Engineer'],
          ['Backend 工程師', 'Backend Engineer'],
          ['資料科學家', 'Data Scientist'],
          ['UX 設計師', 'UX Designer'],
          ['產品經理', 'Product Manager'],
          ['財經分析師', 'Financial Analyst'],
          ['行銷專家', 'Marketing Expert'],
          ['HR 顧問', 'HR Consultant'],
          ['自訂', 'custom']
        ]), 'EXPERTISE_PRESET');
      this.appendDummyInput()
        .appendField('自訂專長:')
        .appendField(new Blockly.FieldTextInput(''), 'EXPERTISE_CUSTOM');
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
    }
  };

  Blockly.Blocks['ai_task'] = {
    init: function() {
      this.appendValueInput('TASK_INPUT').setCheck(null)
        .appendField('📋 任務:');
      this.appendValueInput('TASK_DESCRIPTION').setCheck(null)
        .appendField('詳細說明:');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('定義要完成的任務');
    }
  };

  Blockly.Blocks['ai_context'] = {
    init: function() {
      this.appendValueInput('CONTEXT').setCheck(null)
        .appendField('📝 情境/輸入資料:');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip('提供情境或輸入資料');
    }
  };

  Blockly.Blocks['ai_attachment'] = {
    init: function() {
      this.appendDummyInput().appendField('📎 附件');
      this.appendDummyInput()
        .appendField('來源')
        .appendField(new Blockly.FieldDropdown([
          ['多媒體位址', 'url'],
          ['本機檔案', 'file'],
          ['拖拉上傳', 'drop']
        ]), 'SOURCE_TYPE');
      this.appendValueInput('ATTACHMENT').setCheck(null).appendField('內容');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(190);
      this.setTooltip('可填入 URL、檔案路徑或拖拉提示');
    }
  };

  Blockly.Blocks['ai_knowledge_base'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('📚 知識庫')
        .appendField(new Blockly.FieldDropdown([
          ['產品文件庫', 'product-docs'],
          ['技術手冊庫', 'tech-wiki'],
          ['客服案例庫', 'support-kb'],
          ['法規資料庫', 'compliance-db']
        ]), 'KB_ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip('選擇具備權限可存取的知識庫');
    }
  };

  Blockly.Blocks['ai_constraint'] = {
    init: function() {
      this.appendDummyInput().appendField('⚠️ 限制條件:');
      this.appendDummyInput().appendField(new Blockly.FieldCheckbox('TRUE'), 'USE_BULLETS').appendField('使用條列式');
      this.appendDummyInput().appendField(new Blockly.FieldCheckbox('FALSE'), 'NO_MARKETING').appendField('不使用行銷語');
      this.appendDummyInput().appendField('字數限制:').appendField(new Blockly.FieldNumber(0, 0, 10000), 'MAX_WORDS');
      this.appendDummyInput().appendField('語言:').appendField(new Blockly.FieldDropdown([
        ['繁體中文', 'zh-TW'], ['簡體中文', 'zh-CN'], ['English', 'en']
      ]), 'LANGUAGE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip('設定輸出限制條件');
    }
  };

  Blockly.Blocks['ai_output_format'] = {
    init: function() {
      this.appendDummyInput().appendField('📤 輸出格式:').appendField(new Blockly.FieldDropdown([
        ['標題+摘要+建議', 'structured'], ['JSON', 'json'], ['Markdown', 'markdown'], ['表格', 'table'], ['純文字', 'plain']
      ]), 'FORMAT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip('指定輸出格式');
    }
  };

  Blockly.Blocks['ai_optimizer'] = {
    init: function() {
      this.appendDummyInput().appendField('✨ Prompt優化器');
      this.appendValueInput('ORIGINAL_PROMPT').setCheck(null).appendField('原始Prompt:');
      this.appendDummyInput().appendField(new Blockly.FieldCheckbox('TRUE'), 'AUTO_OPTIMIZE').appendField('自動優化');
      this.setOutput(true, null);
      this.setColour(45);
      this.setTooltip('使用AI優化你的Prompt');
    }
  };

  Blockly.Blocks['text_multiline'] = {
    init: function() {
      this.appendDummyInput().appendField(new Blockly.FieldTextInput('輸入文字'), 'TEXT');
      this.setOutput(true, 'String');
      this.setColour(160);
      this.setTooltip('文字輸入');
    }
  };

  Blockly.Blocks['ai_variable_input'] = {
    init: function() {
      this.appendDummyInput().appendField('變數:').appendField(new Blockly.FieldTextInput('變數名稱'), 'VAR_NAME');
      this.setOutput(true, null);
      this.setColour(330);
      this.setTooltip('引用變數');
    }
  };
}
