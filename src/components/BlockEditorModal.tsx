import { X, Save } from 'lucide-react';
import { useState } from 'react';

interface BlockEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockType: string;
  initialData?: {
    name: string;
    icon: string;
    color: string;
  };
  onSave: (data: { name: string; icon: string; color: string }) => void;
}

const COMMON_EMOJIS = [
  '🎭', '📋', '📝', '⚠️', '📤', '✨', '🔍', '💻', '👨‍💻', '📊',
  '🎯', '📌', '💡', '🔧', '⚙️', '🚀', '📈', '✅', '❌', '⏱️'
];

const COMMON_COLORS = [
  '#5b67a5', '#4a90e2', '#50c878', '#ffa500', '#ff6b6b',
  '#9b59b6', '#1abc9c', '#e74c3c', '#f39c12', '#3498db'
];

export function BlockEditorModal({
  isOpen,
  onClose,
  blockType,
  initialData,
  onSave
}: BlockEditorModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [icon, setIcon] = useState(initialData?.icon || '🧩');
  const [color, setColor] = useState(initialData?.color || '#5b67a5');

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name, icon, color });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">編輯積木（{blockType}）</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              積木名稱
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="輸入積木名稱"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              積木圖示 {icon}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`p-2 text-2xl rounded border-2 transition-all ${
                    icon === emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              積木顏色
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COMMON_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`p-4 rounded border-2 transition-all ${
                    color === c ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-2 w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">預覽：</p>
            <div
              className="px-4 py-2 rounded text-white font-medium inline-block"
              style={{ backgroundColor: color }}
            >
              {icon} {name || '積木名稱'}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
