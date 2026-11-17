import React, { useState } from 'react';
import { 
  Download, FileText, CheckCircle2, AlertTriangle, ShieldAlert, 
  ArrowLeft, Search, Check, RefreshCw, X, Shield, FileCode, CheckCircle
} from 'lucide-react';
import { ScanDetail, Finding, Severity, FindingStatus } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { CodeSnippetViewer } from './CodeSnippetViewer';
import { updateFindingStatus, getReportPdfUrl, getReportJsonUrl } from '../api';

interface ScanDetailViewProps {
  scan: ScanDetail;
  projectName?: string;
  onBack: () => void;
  onRefreshScan: () => void;
}

export const ScanDetailView: React.FC<ScanDetailViewProps> = ({
  scan,
  projectName = 'Project',
  onBack,
  onRefreshScan
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'findings' | 'files'>('findings');

  // Filter findings
  const filteredFindings = scan.findings.filter((f) => {
    const matchesSev = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
    const matchesSearch = 
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.rule_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.file_path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const handleStatusChange = async (findingId: number, newStatus: FindingStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateFindingStatus(findingId, newStatus);
      if (selectedFinding && selectedFinding.id === findingId) {
        setSelectedFinding(updated);
      }
      onRefreshScan();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2 focus-visible:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">
              Scan #{scan.scan_number} Results
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {scan.scan_type}
            </span>
          </div>

          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
            <span>Workspace: <strong className="text-slate-200 font-medium">{projectName}</strong></span>
            <span>&bull;</span>
            <span>{scan.total_files} files inspected</span>
            <span>&bull;</span>
            <span>Execution: {scan.duration_seconds}s</span>
          </div>
        </div>

        {/* Export / Download Actions */}
        <div className="flex items-center space-x-2">
          <a
            href={getReportPdfUrl(scan.id)}
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-750 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Download PDF</span>
          </a>

          <a
            href={getReportJsonUrl(scan.id)}
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-750 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </a>
        </div>
      </div>

      {/* Severity Filter Strip (4-cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Critical */}
        <button
          type="button"
          onClick={() => setSelectedSeverity(selectedSeverity === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            selectedSeverity === 'CRITICAL'
              ? 'bg-rose-950/20 border-rose-500/50 ring-1 ring-rose-500/30'
              : 'bg-[#0F172A]/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="text-rose-400">Critical</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-semibold text-rose-300 mt-1">
            {scan.critical_count}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Immediate exploit risks
          </div>
        </button>

        {/* High */}
        <button
          type="button"
          onClick={() => setSelectedSeverity(selectedSeverity === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            selectedSeverity === 'HIGH'
              ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30'
              : 'bg-[#0F172A]/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="text-amber-400">High</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-semibold text-amber-300 mt-1">
            {scan.high_count}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Vulnerabilities &amp; leaks
          </div>
        </button>

        {/* Medium */}
        <button
          type="button"
          onClick={() => setSelectedSeverity(selectedSeverity === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            selectedSeverity === 'MEDIUM'
              ? 'bg-yellow-950/20 border-yellow-500/50 ring-1 ring-yellow-500/30'
              : 'bg-[#0F172A]/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="text-yellow-400">Medium</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-semibold text-yellow-300 mt-1">
            {scan.medium_count}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Configuration &amp; cryptography
          </div>
        </button>

        {/* Low / Style */}
        <button
          type="button"
          onClick={() => setSelectedSeverity(selectedSeverity === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-3.5 rounded-lg border text-left transition-colors ${
            selectedSeverity === 'LOW'
              ? 'bg-sky-950/20 border-sky-500/50 ring-1 ring-sky-500/30'
              : 'bg-[#0F172A]/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="text-sky-400">Low / Quality</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-semibold text-sky-300 mt-1">
            {scan.low_count}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Code smells &amp; PEP 8 warnings
          </div>
        </button>
      </div>

      {/* View Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-1 p-0.5 bg-slate-900/60 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('findings')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'findings'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Findings Matrix ({scan.total_findings})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'files'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scanned Files ({scan.total_files})
          </button>
        </div>

        {activeTab === 'findings' && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by rule, description, or file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-64 focus:outline-none focus:border-blue-500"
              />
            </div>
            {selectedSeverity !== 'ALL' && (
              <button
                onClick={() => setSelectedSeverity('ALL')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'findings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Findings List (7 or 12 Cols) */}
          <div className={`space-y-2.5 ${selectedFinding ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            {filteredFindings.length === 0 ? (
              <div className="bg-[#0F172A]/50 border border-slate-800 rounded-lg p-8 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-xs font-medium text-slate-200">No findings match this filter</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Try adjusting the severity filter or search keywords.
                </p>
              </div>
            ) : (
              filteredFindings.map((finding) => {
                const isSelected = selectedFinding?.id === finding.id;
                return (
                  <div
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#151F32] border-blue-500/60 ring-1 ring-blue-500/30'
                        : 'bg-[#0F172A]/60 border-slate-800 hover:border-slate-750 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={finding.severity} size="sm" />
                        <span className="font-mono text-xs font-semibold text-slate-200">
                          {finding.rule_id}
                        </span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 font-mono">
                          {finding.tool_source}
                        </span>
                        {finding.cwe_id && (
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 font-mono">
                            {finding.cwe_id}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded border shrink-0 ${
                          finding.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                            : finding.status === 'FALSE_POSITIVE'
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-200 font-medium leading-relaxed">
                      {finding.description}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/40">
                      <span>{finding.file_path}:{finding.line_number}</span>
                      <span className="text-blue-400 group-hover:text-blue-300 font-sans font-medium text-[11px]">
                        Inspect details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Finding Inspector Panel (5 Cols) */}
          {selectedFinding && (
            <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-4 sticky top-20 shadow-xl">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <SeverityBadge severity={selectedFinding.severity} size="sm" />
                    <span className="font-mono text-xs font-semibold text-slate-200">
                      {selectedFinding.rule_id}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-100 mt-1.5 truncate">
                    {selectedFinding.rule_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                  title="Close inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Diagnostic Description */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Diagnostic Message
                </label>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed bg-[#090D16] p-3 rounded-md border border-slate-800">
                  {selectedFinding.description}
                </p>
              </div>

              {/* Code Snippet Viewer */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Context Code
                </label>
                <CodeSnippetViewer
                  filePath={selectedFinding.file_path}
                  lineNumber={selectedFinding.line_number}
                  snippet={selectedFinding.code_snippet}
                />
              </div>

              {/* AI Remediation Guidance */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1.5 block">
                  Remediation &amp; Patch Guidance
                </label>
                <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-md p-3 text-xs text-emerald-200 whitespace-pre-wrap leading-relaxed">
                  {selectedFinding.ai_explanation || 'No remediation guidance available.'}
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                <div className="flex items-center space-x-1.5">
                  {selectedFinding.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(selectedFinding.id, 'RESOLVED')}
                      disabled={isUpdatingStatus}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      Resolve
                    </button>
                  )}
                  {selectedFinding.status !== 'FALSE_POSITIVE' && (
                    <button
                      onClick={() => handleStatusChange(selectedFinding.id, 'FALSE_POSITIVE')}
                      disabled={isUpdatingStatus}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
                    >
                      False Positive
                    </button>
                  )}
                  {selectedFinding.status !== 'OPEN' && (
                    <button
                      onClick={() => handleStatusChange(selectedFinding.id, 'OPEN')}
                      disabled={isUpdatingStatus}
                      className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      Re-open
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Scanned Files Manifest View */
        <div className="bg-[#0F172A]/70 border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">File Path</th>
                <th className="px-4 py-3">Lines of Code</th>
                <th className="px-4 py-3">File Size</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scan.files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-200">{file.relative_path}</td>
                  <td className="px-4 py-2.5 text-slate-400">{file.line_count.toLocaleString()} LOC</td>
                  <td className="px-4 py-2.5 text-slate-400">{(file.file_size_bytes / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
