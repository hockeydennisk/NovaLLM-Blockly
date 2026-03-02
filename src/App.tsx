import { useState, useCallback, useEffect } from 'react';
import * as Blockly from 'blockly';
import { Minimize2, Maximize2 } from 'lucide-react';
import { BlocklyWorkspace } from './components/BlocklyWorkspace';
import { PromptPreview } from './components/PromptPreview';
import { Toolbar } from './components/Toolbar';
import { TemplatesList } from './components/TemplatesList';
import { BlockEditorModal } from './components/BlockEditorModal';
import { TaskQueuePanel, QueueTask } from './components/TaskQueuePanel';
import { generatePromptFromWorkspace } from './blocks/promptGenerator';
import { executePrompt } from './services/novallm';
import { PRESET_TEMPLATES, PresetTemplate } from './data/presetTemplates';
import {
  fetchConversationIdsFromSupabase,
  fetchPromptTemplatesFromSupabase,
  savePromptTemplateToSupabase,
  upsertConversationSessionToSupabase,
} from './lib/supabase';

const USER_TEMPLATE_PREFIX = 'prompt_template_';
const MARKETPLACE_KEY = 'template_marketplace';
const LOCAL_CONVERSATION_IDS_KEY = 'conversation_ids';

function App() {
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [prompt, setPrompt] = useState('');
  const [showBlockEditor, setShowBlockEditor] = useState(false);
  const [templates, setTemplates] = useState<PresetTemplate[]>(PRESET_TEMPLATES);
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<PresetTemplate[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [queue, setQueue] = useState<QueueTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<QueueTask | null>(null);
  const [conversationIds, setConversationIds] = useState<string[]>([]);

  useEffect(() => {
    const bootstrap = async () => {
    const loaded: PresetTemplate[] = [...PRESET_TEMPLATES];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(USER_TEMPLATE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          loaded.push({
            id: key,
            name: data.name,
            description: `儲存於 ${new Date(data.savedAt).toLocaleString()}`,
            icon: data.icon || '💾',
            xml: data.xml,
          });
        } catch {
          // ignore broken template
        }
      }
    }

    const remoteTemplates = await fetchPromptTemplatesFromSupabase();
    const mappedRemoteTemplates = remoteTemplates.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description || '雲端模板',
      icon: '☁️',
      xml: template.workspace_xml,
    }));

    setTemplates([...loaded, ...mappedRemoteTemplates]);

    try {
      setMarketplaceTemplates(JSON.parse(localStorage.getItem(MARKETPLACE_KEY) || '[]'));
    } catch {
      setMarketplaceTemplates([]);
    }
    const localConversationIds = JSON.parse(localStorage.getItem(LOCAL_CONVERSATION_IDS_KEY) || '[]');
    const remoteConversationIds = await fetchConversationIdsFromSupabase();
    const mergedConversationIds = Array.from(new Set([...localConversationIds, ...remoteConversationIds]));
    setConversationIds(mergedConversationIds);
  };

    bootstrap();
  }, []);

  const handleWorkspaceChange = useCallback((ws: Blockly.WorkspaceSvg) => {
    setWorkspace(ws);
    setPrompt(generatePromptFromWorkspace(ws));
  }, []);

  const handleExecute = async (promptToExecute: string) => {
    const taskId = `task_${Date.now()}`;
    const conversationId = `conv_${Date.now()}`;
    const newTask: QueueTask = {
      id: taskId,
      prompt: promptToExecute,
      status: 'queued',
      progress: 0,
    };

    setQueue((prev) => [newTask, ...prev]);
    setConversationIds((prev) => {
      const next = Array.from(new Set([conversationId, ...prev]));
      localStorage.setItem(LOCAL_CONVERSATION_IDS_KEY, JSON.stringify(next));
      return next;
    });

    const progressTimer = window.setInterval(() => {
      setQueue((prev) => prev.map((t) => (
        t.id === taskId && t.progress < 90
          ? { ...t, status: 'running', progress: t.progress + 10 }
          : t
      )));
    }, 300);

    try {
      const response = await executePrompt({ prompt: promptToExecute });
      window.clearInterval(progressTimer);
      setQueue((prev) => prev.map((t) => (
        t.id === taskId
          ? {
            ...t,
            status: response.success ? 'completed' : 'failed',
            progress: 100,
            result: response.success ? response.response : `錯誤: ${response.error}`,
            executionTime: response.executionTime,
          }
          : t
      )));
      await upsertConversationSessionToSupabase({
        conversation_id: conversationId,
        last_prompt: promptToExecute,
        last_result: response.success ? response.response : `錯誤: ${response.error}`,
      });
    } catch (error) {
      window.clearInterval(progressTimer);
      setQueue((prev) => prev.map((t) => (
        t.id === taskId
          ? {
            ...t,
            status: 'failed',
            progress: 100,
            result: `執行失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
          }
          : t
      )));
      await upsertConversationSessionToSupabase({
        conversation_id: conversationId,
        last_prompt: promptToExecute,
        last_result: `執行失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
      });
    }
  };

  const handleSave = () => {
    if (!workspace) return;

    const xmlText = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    const templateName = window.prompt('請輸入模板名稱：');
    if (!templateName) return;

    const key = `${USER_TEMPLATE_PREFIX}${Date.now()}`;
    const data = {
      name: templateName,
      xml: xmlText,
      prompt,
      icon: '💾',
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(data));
    savePromptTemplateToSupabase({
      name: data.name,
      description: '使用者儲存模板',
      workspace_xml: data.xml,
      generated_prompt: data.prompt,
    });

    setTemplates((prev) => [
      ...prev,
      {
        id: key,
        name: data.name,
        description: `儲存於 ${new Date(data.savedAt).toLocaleString()}`,
        icon: data.icon,
        xml: data.xml,
      },
    ]);

    alert('模板已儲存並加入快速模板列表！');
  };

  const handleLoad = () => {
    const dynamic = templates.filter((t) => t.id.startsWith(USER_TEMPLATE_PREFIX));
    if (dynamic.length === 0) {
      alert('沒有已儲存的模板');
      return;
    }

    const names = dynamic.map((t, i) => `${i + 1}. ${t.name}`).join('\n');
    const selection = window.prompt(`請選擇要載入的模板 (輸入編號)：\n\n${names}`);
    if (!selection) return;

    const index = parseInt(selection, 10) - 1;
    if (index >= 0 && index < dynamic.length) {
      handleSelectPresetTemplate(dynamic[index]);
    }
  };

  const handleShare = () => {
    if (!workspace) return;
    navigator.clipboard.writeText(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace)));
    alert('模板XML已複製到剪貼簿！');
  };

  const handleNewTemplate = () => {
    if (!workspace) return;
    const confirmed = window.confirm('確定要清空工作區並建立新模板嗎？');
    if (confirmed) {
      workspace.clear();
      setPrompt('');
      setQueue([]);
    }
  };

  const handleSelectPresetTemplate = (template: PresetTemplate) => {
    if (!workspace) return;
    try {
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(template.xml), workspace);
    } catch {
      alert('載入模板失敗');
    }
  };

  const handleSaveBlockEditor = (data: { name: string; icon: string; color: string }) => {
    const saved = JSON.parse(localStorage.getItem('editable_blocks') || '[]');
    saved.push({ id: `${Date.now()}`, ...data });
    localStorage.setItem('editable_blocks', JSON.stringify(saved));
    alert('自訂積木已建立，請重新整理後於「自訂積木」分類使用。');
  };

  const handleDeleteTemplate = (id: string) => {
    if (id.startsWith(USER_TEMPLATE_PREFIX)) localStorage.removeItem(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePublishTemplate = (template: PresetTemplate) => {
    const next = [
      ...marketplaceTemplates,
      { ...template, id: `market_${Date.now()}` },
    ];
    setMarketplaceTemplates(next);
    localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(next));
  };

  const handleImportMarketplace = (template: PresetTemplate) => {
    const imported = { ...template, id: `${USER_TEMPLATE_PREFIX}${Date.now()}` };
    setTemplates((prev) => [imported, ...prev]);
  };

  if (isMinimized) {
    return (
      <button
        className="fixed right-6 bottom-6 z-50 rounded-full w-14 h-14 shadow-xl bg-blue-600 text-white flex items-center justify-center"
        onClick={() => setIsMinimized(false)}
        title="展開 NVT 小精靈"
      >
        <Maximize2 size={22} />
      </button>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NVT Magic Block - Visual Prompt Engineering Platform</h1>
            <p className="text-blue-100 text-sm mt-1">用積木組合AI提示詞，讓Prompt成為可視化的企業資產</p>
            <p className="text-blue-100 text-xs mt-1">已管理對話數量：{conversationIds.length}</p>
          </div>
          <button onClick={() => setIsMinimized(true)} className="p-2 rounded bg-white/20 hover:bg-white/30" title="縮小成常駐小精靈">
            <Minimize2 size={20} />
          </button>
        </div>
        <Toolbar onSave={handleSave} onLoad={handleLoad} onShare={handleShare} onNewTemplate={handleNewTemplate} onEditBlock={() => setShowBlockEditor(true)} />
      </header>

      <TemplatesList
        templates={templates}
        marketplaceTemplates={marketplaceTemplates}
        onSelectTemplate={handleSelectPresetTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onPublishTemplate={handlePublishTemplate}
        onImportMarketplace={handleImportMarketplace}
      />

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50"><h2 className="text-lg font-semibold text-gray-800">Blockly Workspace</h2></div>
          <div className="flex-1 overflow-hidden"><BlocklyWorkspace onWorkspaceChange={handleWorkspaceChange} /></div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1"><PromptPreview prompt={prompt} onExecute={handleExecute} isExecuting={queue.some((t) => t.status === 'running' || t.status === 'queued')} /></div>
          <div className="flex-1"><TaskQueuePanel tasks={queue} selectedTask={selectedTask} onOpenTask={setSelectedTask} onCloseTask={() => setSelectedTask(null)} /></div>
        </div>
      </div>

      <BlockEditorModal isOpen={showBlockEditor} onClose={() => setShowBlockEditor(false)} blockType="custom" onSave={handleSaveBlockEditor} />
    </div>
  );
}

export default App;
