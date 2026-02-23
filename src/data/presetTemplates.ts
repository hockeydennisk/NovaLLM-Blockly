export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  xml: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review 助手',
    description: '專業的程式碼審查與改進建議',
    icon: '👨‍💻',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="ai_persona" x="10" y="10">
        <field name="ROLE">資深程式專家</field>
        <field name="EXPERTISE_PRESET">Frontend Engineer</field>
        <field name="TONE">professional</field>
        <next>
          <block type="ai_task">
            <field name="TASK_INPUT"></field>
            <value name="TASK_INPUT">
              <block type="text">
                <field name="TEXT">請審查以下程式碼並提供改進建議</field>
              </block>
            </value>
            <next>
              <block type="ai_context">
                <value name="CONTEXT">
                  <block type="text">
                    <field name="TEXT">{程式碼}</field>
                  </block>
                </value>
                <next>
                  <block type="ai_constraint">
                    <field name="USE_BULLETS">TRUE</field>
                    <field name="NO_MARKETING">FALSE</field>
                    <field name="MAX_WORDS">500</field>
                    <field name="LANGUAGE">zh-TW</field>
                    <next>
                      <block type="ai_output_format">
                        <field name="FORMAT">structured</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </xml>`
  },
  {
    id: 'meeting-notes',
    name: '會議紀錄整理',
    description: '快速整理會議內容成結構化紀錄',
    icon: '📋',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="ai_persona" x="10" y="10">
        <field name="ROLE">專業會議記錄員</field>
        <field name="EXPERTISE_PRESET">Product Manager</field>
        <field name="TONE">concise</field>
        <next>
          <block type="ai_task">
            <value name="TASK_INPUT">
              <block type="text">
                <field name="TEXT">整理會議內容成結構化的會議紀錄</field>
              </block>
            </value>
            <next>
              <block type="ai_context">
                <value name="CONTEXT">
                  <block type="text">
                    <field name="TEXT">{會議逐字稿}</field>
                  </block>
                </value>
                <next>
                  <block type="ai_constraint">
                    <field name="USE_BULLETS">TRUE</field>
                    <field name="NO_MARKETING">FALSE</field>
                    <field name="MAX_WORDS">0</field>
                    <field name="LANGUAGE">zh-TW</field>
                    <next>
                      <block type="ai_output_format">
                        <field name="FORMAT">markdown</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </xml>`
  },
  {
    id: 'qa-log-analysis',
    name: 'QA Log 分析',
    description: '分析測試 log 找出問題根源',
    icon: '🔍',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="ai_persona" x="10" y="10">
        <field name="ROLE">資深 QA 工程師</field>
        <field name="EXPERTISE_PRESET">Backend Engineer</field>
        <field name="TONE">professional</field>
        <next>
          <block type="ai_task">
            <value name="TASK_INPUT">
              <block type="text">
                <field name="TEXT">分析測試 log 找出根本原因</field>
              </block>
            </value>
            <next>
              <block type="ai_context">
                <value name="CONTEXT">
                  <block type="text">
                    <field name="TEXT">{測試 log}</field>
                  </block>
                </value>
                <next>
                  <block type="ai_constraint">
                    <field name="USE_BULLETS">TRUE</field>
                    <field name="NO_MARKETING">FALSE</field>
                    <field name="MAX_WORDS">300</field>
                    <field name="LANGUAGE">zh-TW</field>
                    <next>
                      <block type="ai_output_format">
                        <field name="FORMAT">structured</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </xml>`
  }
];
