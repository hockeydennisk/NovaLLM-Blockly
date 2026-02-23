import { Trash2, Plus } from 'lucide-react';
import { PresetTemplate } from '../data/presetTemplates';

interface TemplatesListProps {
  templates: PresetTemplate[];
  onSelectTemplate: (template: PresetTemplate) => void;
  onDeleteTemplate?: (id: string) => void;
}

export function TemplatesList({ templates, onSelectTemplate, onDeleteTemplate }: TemplatesListProps) {
  return (
    <div className="flex flex-col bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-700">快速模板</h3>
      </div>
      <div className="px-4 pb-3 overflow-x-auto">
        <div className="flex gap-3">
          {templates.map(template => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="flex-shrink-0 w-48 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{template.icon}</span>
                {onDeleteTemplate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(template.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                    title="刪除模板"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <h4 className="font-semibold text-sm text-gray-800 mb-1">{template.name}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
              <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-600 font-medium">
                點擊載入
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
