import { X } from 'lucide-react';

export interface QueueTask {
  id: string;
  prompt: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: string;
  executionTime?: number;
}

interface TaskQueuePanelProps {
  tasks: QueueTask[];
  selectedTask: QueueTask | null;
  onOpenTask: (task: QueueTask) => void;
  onCloseTask: () => void;
}

export function TaskQueuePanel({ tasks, selectedTask, onOpenTask, onCloseTask }: TaskQueuePanelProps) {
  const renderMarkdownLike = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-semibold mt-2 mb-1">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-semibold mt-2 mb-1">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold mt-2 mb-1">{trimmed.slice(2)}</h1>;
      }
      if (/^[-*]\s+/.test(trimmed)) {
        return <p key={idx} className="pl-4">• {trimmed.replace(/^[-*]\s+/, '')}</p>;
      }
      if (/^\d+\.\s+/.test(trimmed)) {
        return <p key={idx} className="pl-4">{trimmed}</p>;
      }

      return <p key={idx}>{trimmed || '\u00A0'}</p>;
    });
  };

  const renderResult = (result?: string) => {
    if (!result) return '無結果';

    try {
      const parsed = JSON.parse(result);
      return (
        <pre className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return (
        <div className="bg-gray-50 p-3 rounded text-sm leading-6 space-y-1">{renderMarkdownLike(result)}</div>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">任務 Queue 面板</h2>
        </div>
        <div className="flex-1 p-4 overflow-auto grid grid-cols-2 gap-3 content-start">
          {tasks.length === 0 && <div className="text-gray-400 text-sm">按下執行後，任務會在背景排隊處理。</div>}
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => task.status === 'completed' && onOpenTask(task)}
              className="relative rounded-2xl border border-slate-300 bg-slate-100 h-24 overflow-hidden text-left px-3 py-2"
            >
              <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${task.status === 'failed' ? 'bg-red-300' : 'bg-blue-300'}`}
                style={{ height: `${task.progress}%` }}
              />
              <div className="relative z-10">
                <div className="font-semibold text-sm">任務 {task.id.slice(-4)}</div>
                <div className="text-xs text-slate-700 capitalize">{task.status}</div>
                <div className="text-xs text-slate-700">{task.progress}%</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onCloseTask}>
          <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold">任務結果 #{selectedTask.id.slice(-6)}</h3>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={onCloseTask}><X size={18} /></button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <h4 className="font-semibold mb-2 text-sm">Prompt</h4>
              <pre className="text-xs bg-gray-50 p-2 rounded mb-4 whitespace-pre-wrap">{selectedTask.prompt}</pre>
              <h4 className="font-semibold mb-2 text-sm">Result</h4>
              {renderResult(selectedTask.result)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
