export const toolboxConfig = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'AI Prompt Blocks',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'ai_persona' },
        { kind: 'block', type: 'ai_task' },
        { kind: 'block', type: 'ai_context' },
        { kind: 'block', type: 'ai_attachment' },
        { kind: 'block', type: 'ai_knowledge_base' },
        { kind: 'block', type: 'ai_constraint' },
        { kind: 'block', type: 'ai_output_format' },
        { kind: 'block', type: 'ai_optimizer' }
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '#5CA65C',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_multiline' },
        { kind: 'block', type: 'text_join' }
      ]
    },
    {
      kind: 'category',
      name: '自訂積木',
      colour: '#A65C81',
      custom: 'CUSTOM_BLOCKS'
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#A65C81',
      custom: 'VARIABLE'
    }
  ]
};
