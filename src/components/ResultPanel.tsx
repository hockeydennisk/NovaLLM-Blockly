import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

interface ResultPanelProps {
  result: string;
  isLoading: boolean;
  executionTime?: number;
}

export function ResultPanel({ result, isLoading, executionTime }: ResultPanelProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Result</h2>
          {executionTime !== undefined && (
            <span className="text-sm text-gray-500">
              ({executionTime}ms)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleFeedback('up')}
            className={`p-2 rounded transition-colors ${
              feedback === 'up'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
            title="有用"
          >
            <ThumbsUp size={18} />
          </button>
          <button
            onClick={() => handleFeedback('down')}
            className={`p-2 rounded transition-colors ${
              feedback === 'down'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
            title="不準確"
          >
            <ThumbsDown size={18} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!result}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="複製結果"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">執行中...</p>
            </div>
          </div>
        ) : result ? (
          <pre className="w-full h-full p-3 bg-gray-50 rounded font-mono text-sm whitespace-pre-wrap">
            {result}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            執行Prompt後結果將顯示在此...
          </div>
        )}
      </div>
    </div>
  );
}
