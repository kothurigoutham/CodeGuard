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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2 focus-visible:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Scan #{scan.scan_number} Results
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {scan.scan_type}
            </span>
          </div>

          <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
            <span>Workspace: <strong className="text-slate-900 font-medium">{projectName}</strong></span>
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
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span>Download PDF</span>
          </a>

          <a
            href={getReportJsonUrl(scan.id)}
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
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
          className={`p-3.5 rounded-lg border text-left transition-colors shadow-sm ${
            selectedSeverity === 'CRITICAL'
              ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="text-rose-700 font-semibold">Critical</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-semibold text-rose-700 mt-1">
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
          className={`p-3.5 rounded-lg border text-left transition-colors shadow-sm ${
            selectedSeverity === 'HIGH'
              ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="text-amber-800 font-semibold">High</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-semibold text-amber-800 mt-1">
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
          className={`p-3.5 rounded-lg border text-left transition-colors shadow-sm ${
            selectedSeverity === 'MEDIUM'
              ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="text-yellow-800 font-semibold">Medium</span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-semibold text-yellow-800 mt-1">
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
          className={`p-3.5 rounded-lg border text-left transition-colors shadow-sm ${
            selectedSeverity === 'LOW'
              ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="text-sky-800 font-semibold">Low / Quality</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-semibold text-sky-800 mt-1">
            {scan.low_count}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Code smells &amp; PEP 8 warnings
          </div>
        </button>
      </div>

      {/* View Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-1 p-0.5 bg-slate-100 border border-slate-200/80 rounded-lg">
          <button
            onClick={() => setActiveTab('findings')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'findings'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Findings Matrix ({scan.total_findings})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'files'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scanned Files ({scan.total_files})
          </button>
        </div>

        {activeTab === 'findings' && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by rule, description, or file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 w-64 focus:outline-none focus:border-blue-600 shadow-sm"
              />
            </div>
            {selectedSeverity !== 'ALL' && (
              <button
                onClick={() => setSelectedSeverity('ALL')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1"
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
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-xs font-medium text-slate-800">No findings match this filter</h3>
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
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer text-left shadow-sm ${
                      isSelected
                        ? 'bg-blue-50/40 border-blue-400 ring-1 ring-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={finding.severity} size="sm" />
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {finding.rule_id}
                        </span>
                        <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">
                          {finding.tool_source}
                        </span>
                        {finding.cwe_id && (
                          <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">
                            {finding.cwe_id}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded border shrink-0 ${
                          finding.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : finding.status === 'FALSE_POSITIVE'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-800 font-medium leading-relaxed">
                      {finding.description}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                      <span>{finding.file_path}:{finding.line_number}</span>
                      <span className="text-blue-600 group-hover:text-blue-700 font-sans font-medium text-[11px]">
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
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 space-y-4 sticky top-20 shadow-md">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <SeverityBadge severity={selectedFinding.severity} size="sm" />
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {selectedFinding.rule_id}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 mt-1.5 truncate">
                    {selectedFinding.rule_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                  title="Close inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Diagnostic Description */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Diagnostic Message
                </label>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200">
                  {selectedFinding.description}
                </p>
              </div>

              {/* Code Snippet Viewer */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5 block">
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
                <label className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 mb-1.5 block">
                  Remediation &amp; Patch Guidance
                </label>
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-xs text-emerald-900 whitespace-pre-wrap leading-relaxed">
                  {selectedFinding.ai_explanation || 'No remediation guidance available.'}
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium">Status:</span>
                <div className="flex items-center space-x-1.5">
                  {selectedFinding.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(selectedFinding.id, 'RESOLVED')}
                      disabled={isUpdatingStatus}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-sm"
                    >
                      Resolve
                    </button>
                  )}
                  {selectedFinding.status !== 'FALSE_POSITIVE' && (
                    <button
                      onClick={() => handleStatusChange(selectedFinding.id, 'FALSE_POSITIVE')}
                      disabled={isUpdatingStatus}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors disabled:opacity-50 shadow-sm"
                    >
                      False Positive
                    </button>
                  )}
                  {selectedFinding.status !== 'OPEN' && (
                    <button
                      onClick={() => handleStatusChange(selectedFinding.id, 'OPEN')}
                      disabled={isUpdatingStatus}
                      className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-sm"
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
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">File Path</th>
                <th className="px-4 py-3">Lines of Code</th>
                <th className="px-4 py-3">File Size</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scan.files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-800">{file.relative_path}</td>
                  <td className="px-4 py-2.5 text-slate-600">{file.line_count.toLocaleString()} LOC</td>
                  <td className="px-4 py-2.5 text-slate-600">{(file.file_size_bytes / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
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
