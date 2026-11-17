import React from 'react';
import { X, GitCompare, ShieldCheck, AlertCircle, RefreshCw, FileCode } from 'lucide-react';
import { ScanDiffResult } from '../types';
import { SeverityBadge } from './SeverityBadge';

interface ScanDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffData: ScanDiffResult | null;
}

export const ScanDiffModal: React.FC<ScanDiffModalProps> = ({
  isOpen,
  onClose,
  diffData
}) => {
  if (!isOpen || !diffData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-3xl max-h-[85vh] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Audit Comparison Diff
              </h2>
              <p className="text-[11px] text-slate-500">
                Baseline Scan #{diffData.baseline_scan_id} &rarr; Current Scan #{diffData.current_scan_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diff Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-center">
          <div className="p-3 rounded-md bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">New Regressions</span>
            <div className="text-xl font-bold text-rose-700 mt-1">{diffData.metrics.new_count}</div>
          </div>
          <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">Resolved Issues</span>
            <div className="text-xl font-bold text-emerald-800 mt-1">{diffData.metrics.fixed_count}</div>
          </div>
          <div className="p-3 rounded-md bg-white border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Recurring Debt</span>
            <div className="text-xl font-bold text-slate-800 mt-1">{diffData.metrics.recurring_count}</div>
          </div>
        </div>

        {/* Scrollable Findings Comparison Lists */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* 1. Fixed Issues */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resolved Findings ({diffData.fixed_findings.length})</span>
            </div>
            {diffData.fixed_findings.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                No previously identified findings were resolved in this scan.
              </p>
            ) : (
              <div className="space-y-1.5">
                {diffData.fixed_findings.map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-md bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <SeverityBadge severity={f.severity} size="sm" />
                      <span className="font-mono text-xs font-semibold text-slate-800">{f.rule_id}</span>
                      <span className="text-slate-600 text-[11px] truncate max-w-sm">{f.description}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">
                      {f.file_path}:{f.line_number}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. New Issues */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-700 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Newly Introduced Vulnerabilities ({diffData.new_findings.length})</span>
            </div>
            {diffData.new_findings.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                No new vulnerabilities were introduced in this audit.
              </p>
            ) : (
              <div className="space-y-1.5">
                {diffData.new_findings.map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-md bg-rose-50/50 border border-rose-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <SeverityBadge severity={f.severity} size="sm" />
                      <span className="font-mono text-xs font-semibold text-slate-800">{f.rule_id}</span>
                      <span className="text-slate-600 text-[11px] truncate max-w-sm">{f.description}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">
                      {f.file_path}:{f.line_number}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Recurring Issues */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-2">
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Recurring Technical Debt ({diffData.recurring_findings.length})</span>
            </div>
            {diffData.recurring_findings.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                No persistent findings.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {diffData.recurring_findings.map((f) => (
                  <div
                    key={f.id}
                    className="p-2 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <SeverityBadge severity={f.severity} size="sm" />
                      <span className="font-mono text-xs font-semibold text-slate-800">{f.rule_id}</span>
                      <span className="text-slate-600 text-[11px] truncate max-w-sm">{f.description}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">
                      {f.file_path}:{f.line_number}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-sm"
          >
            Close Diff
          </button>
        </div>
      </div>
    </div>
  );
};
