import { Save, FolderOpen, Share2, Sparkles, Edit3 } from 'lucide-react';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onShare: () => void;
  onNewTemplate: () => void;
  onEditBlock?: () => void;
}

export function Toolbar({ onSave, onLoad, onShare, onNewTemplate, onEditBlock }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
      <button
        onClick={onNewTemplate}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
      >
        <Sparkles size={18} />
        新模板
      </button>
      <div className="w-px h-6 bg-gray-300 mx-2"></div>
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Save size={18} />
        儲存
      </button>
      <button
        onClick={onLoad}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FolderOpen size={18} />
        載入
      </button>
      <button
        onClick={onShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Share2 size={18} />
        分享
      </button>
      {onEditBlock && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button
            onClick={onEditBlock}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit3 size={18} />
            編輯積木
          </button>
        </>
      )}
    </div>
  );
}
