import { Download, Trash2, Upload } from 'lucide-react';
import { PresetTemplate } from '../data/presetTemplates';

interface TemplatesListProps {
  templates: PresetTemplate[];
  marketplaceTemplates: PresetTemplate[];
  onSelectTemplate: (template: PresetTemplate) => void;
  onDeleteTemplate?: (id: string) => void;
  onPublishTemplate: (template: PresetTemplate) => void;
  onImportMarketplace: (template: PresetTemplate) => void;
}

export function TemplatesList({
  templates,
  marketplaceTemplates,
  onSelectTemplate,
  onDeleteTemplate,
  onPublishTemplate,
  onImportMarketplace,
}: TemplatesListProps) {
  return (
    <div className="flex flex-col bg-white border-b border-gray-200 gap-3 p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">快速模板</h3>
        <div className="mt-2 flex gap-3 overflow-x-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="flex-shrink-0 w-48 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{template.icon}</span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPublishTemplate(template);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-blue-500 hover:text-blue-700 transition-opacity"
                    title="上傳到模板市集"
                  >
                    <Upload size={14} />
                  </button>
                  {onDeleteTemplate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTemplate(template.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                      title="刪除模板"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-sm text-gray-800 mb-1">{template.name}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700">模板市集</h3>
        <div className="mt-2 flex gap-3 overflow-x-auto">
          {marketplaceTemplates.length === 0 && (
            <div className="text-xs text-gray-500 py-2">目前尚無市集模板，先上傳一個吧！</div>
          )}
          {marketplaceTemplates.map((template) => (
            <div
              key={template.id}
              className="flex-shrink-0 w-56 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{template.icon}</span>
                <button
                  onClick={() => onImportMarketplace(template)}
                  className="p-1 text-emerald-700 hover:text-emerald-900"
                  title="下載到快速模板"
                >
                  <Download size={16} />
                </button>
              </div>
              <h4 className="font-semibold text-sm text-gray-800">{template.name}</h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
