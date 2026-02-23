export const toolboxConfig = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'AI Prompt Blocks',
      colour: '#5C81A6',
      contents: [
        {
          kind: 'block',
          type: 'ai_persona'
        },
        {
          kind: 'block',
          type: 'ai_task'
        },
        {
          kind: 'block',
          type: 'ai_context'
        },
        {
          kind: 'block',
          type: 'ai_constraint'
        },
        {
          kind: 'block',
          type: 'ai_output_format'
        },
        {
          kind: 'block',
          type: 'ai_optimizer'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '#5C68A6',
      contents: [
        {
          kind: 'block',
          type: 'controls_if'
        },
        {
          kind: 'block',
          type: 'logic_compare'
        },
        {
          kind: 'block',
          type: 'logic_operation'
        },
        {
          kind: 'block',
          type: 'logic_boolean'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '#5CA65C',
      contents: [
        {
          kind: 'block',
          type: 'text'
        },
        {
          kind: 'block',
          type: 'text_multiline'
        },
        {
          kind: 'block',
          type: 'text_join'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#A65C81',
      custom: 'VARIABLE'
    }
  ]
};
