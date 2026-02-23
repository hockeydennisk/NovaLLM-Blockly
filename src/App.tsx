import { useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { BlocklyWorkspace } from './components/BlocklyWorkspace';
import { PromptPreview } from './components/PromptPreview';
import { ResultPanel } from './components/ResultPanel';
import { Toolbar } from './components/Toolbar';
import { TemplatesList } from './components/TemplatesList';
import { BlockEditorModal } from './components/BlockEditorModal';
import { generatePromptFromWorkspace } from './blocks/promptGenerator';
import { executePrompt } from './services/novallm';
import { PRESET_TEMPLATES, PresetTemplate } from './data/presetTemplates';

function App() {
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [showBlockEditor, setShowBlockEditor] = useState(false);
  const [templates, setTemplates] = useState(PRESET_TEMPLATES);

  const handleWorkspaceChange = useCallback((ws: Blockly.WorkspaceSvg) => {
    setWorkspace(ws);
    const generatedPrompt = generatePromptFromWorkspace(ws);
    setPrompt(generatedPrompt);
  }, []);

  const handleExecute = async (promptToExecute: string) => {
    setIsExecuting(true);
    setResult('');

    try {
      const response = await executePrompt({ prompt: promptToExecute });
      setResult(response.success ? response.response : `錯誤: ${response.error}`);
      setExecutionTime(response.executionTime);
    } catch (error) {
      setResult(`執行失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    if (!workspace) return;

    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);

    const templateName = window.prompt('請輸入模板名稱：');
    if (!templateName) return;

    localStorage.setItem(`prompt_template_${Date.now()}`, JSON.stringify({
      name: templateName,
      xml: xmlText,
      prompt: prompt,
      savedAt: new Date().toISOString()
    }));

    alert('模板已儲存！');
  };

  const handleLoad = () => {
    const templates: Array<{ key: string; name: string; savedAt: string }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('prompt_template_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          templates.push({ key, name: data.name, savedAt: data.savedAt });
        } catch (error) {
          console.error('Failed to parse template:', error);
        }
      }
    }

    if (templates.length === 0) {
      alert('沒有已儲存的模板');
      return;
    }

    const templateList = templates
      .map((t, i) => `${i + 1}. ${t.name} (${new Date(t.savedAt).toLocaleString()})`)
      .join('\n');

    const selection = window.prompt(`請選擇要載入的模板 (輸入編號)：\n\n${templateList}`);
    if (!selection) return;

    const index = parseInt(selection) - 1;
    if (index >= 0 && index < templates.length) {
      const templateData = JSON.parse(localStorage.getItem(templates[index].key) || '');
      if (workspace && templateData.xml) {
        workspace.clear();
        const xml = Blockly.utils.xml.textToDom(templateData.xml);
        Blockly.Xml.domToWorkspace(xml, workspace);
      }
    }
  };

  const handleShare = () => {
    if (!workspace) return;

    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);

    navigator.clipboard.writeText(xmlText);
    alert('模板XML已複製到剪貼簿！您可以分享給其他人。');
  };

  const handleNewTemplate = () => {
    if (workspace) {
      const confirmed = window.confirm('確定要清空工作區並建立新模板嗎？');
      if (confirmed) {
        workspace.clear();
        setPrompt('');
        setResult('');
      }
    }
  };

  const handleSelectPresetTemplate = (template: PresetTemplate) => {
    if (workspace) {
      try {
        workspace.clear();
        const xml = Blockly.utils.xml.textToDom(template.xml);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (error) {
        console.error('Failed to load template:', error);
        alert('載入模板失敗');
      }
    }
  };

  const handleSaveBlockEditor = (data: { name: string; icon: string; color: string }) => {
    console.log('Block editor data:', data);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">NVT Magic Block - Visual Prompt Engineering Platform</h1>
          <p className="text-blue-100 text-sm mt-1">用積木組合AI提示詞，讓Prompt成為可視化的企業資產</p>
        </div>
        <Toolbar
          onSave={handleSave}
          onLoad={handleLoad}
          onShare={handleShare}
          onNewTemplate={handleNewTemplate}
          onEditBlock={() => setShowBlockEditor(true)}
        />
      </header>

      <TemplatesList
        templates={templates}
        onSelectTemplate={handleSelectPresetTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Blockly Workspace</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <BlocklyWorkspace onWorkspaceChange={handleWorkspaceChange} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <PromptPreview
              prompt={prompt}
              onExecute={handleExecute}
              isExecuting={isExecuting}
            />
          </div>
          <div className="flex-1">
            <ResultPanel
              result={result}
              isLoading={isExecuting}
              executionTime={executionTime}
            />
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-semibold">提示：</span> 從左側拖曳AI積木到工作區，組合成完整的Prompt
          </div>
          <div>
            Powered by Blockly & NovaLLM
          </div>
        </div>
      </footer>

      <BlockEditorModal
        isOpen={showBlockEditor}
        onClose={() => setShowBlockEditor(false)}
        blockType="custom"
        onSave={handleSaveBlockEditor}
      />
    </div>
  );
}

export default App;
