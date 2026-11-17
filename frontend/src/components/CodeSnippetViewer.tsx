import React, { useState } from 'react';
import { FileCode, Copy, Check } from 'lucide-react';

interface CodeSnippetViewerProps {
  filePath: string;
  lineNumber: number;
  snippet: string | null;
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  filePath,
  lineNumber,
  snippet
}) => {
  const [copied, setCopied] = useState(false);

  if (!snippet) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 italic">
        Context code preview is not available for this finding.
      </div>
    );
  }

  const lines = snippet.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.replace(/^>>>\s*/gm, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden text-xs shadow-sm">
      {/* File & Line Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-2 font-mono text-slate-700 truncate">
          <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate font-medium">{filePath}</span>
          <span className="text-slate-400 text-[11px]">#L{lineNumber}</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-200/60 transition-colors shrink-0 font-medium"
          title="Copy snippet"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <div className="overflow-x-auto font-mono text-[12px] py-2 leading-relaxed bg-white">
        {lines.map((lineText, idx) => {
          const isTarget = lineText.startsWith('>>>');
          const cleanText = isTarget ? lineText.replace(/^>>>\s?/, '') : lineText;

          return (
            <div
              key={idx}
              className={`flex items-start px-3 py-0.5 transition-colors ${
                isTarget
                  ? 'bg-rose-50 border-l-2 border-rose-500 text-rose-950 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="w-6 shrink-0 text-right pr-3 select-none text-[11px] text-slate-400 font-mono">
                {idx + 1}
              </span>
              <pre className="font-mono overflow-visible whitespace-pre font-normal m-0 text-slate-800">
                {cleanText || ' '}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
