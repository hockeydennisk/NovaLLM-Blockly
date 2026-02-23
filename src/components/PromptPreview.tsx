import { Copy, Send } from 'lucide-react';
import { useState } from 'react';

interface PromptPreviewProps {
  prompt: string;
  onExecute: (prompt: string) => void;
  isExecuting: boolean;
}

export function PromptPreview({ prompt, onExecute, isExecuting }: PromptPreviewProps) {
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const displayPrompt = isEditing ? editedPrompt : prompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPrompt);
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditedPrompt(prompt);
      setIsEditing(true);
    }
  };

  const handleExecute = () => {
    onExecute(displayPrompt);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Prompt</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="複製Prompt"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting || !displayPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
            {isExecuting ? '執行中...' : '執行'}
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {isEditing ? (
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
            autoFocus
          />
        ) : (
          <pre
            onClick={handleEdit}
            className="w-full h-full p-3 bg-gray-50 rounded font-mono text-sm whitespace-pre-wrap cursor-text hover:bg-gray-100 transition-colors"
          >
            {displayPrompt || '在左側組合積木以生成Prompt...'}
          </pre>
        )}
      </div>
    </div>
  );
}
