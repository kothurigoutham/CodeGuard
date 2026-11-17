import React from 'react';
import { 
  ShieldCheck, AlertTriangle, Layers, FolderGit2, Plus, 
  Clock, FileCode, CheckCircle2, UploadCloud, ChevronRight
} from 'lucide-react';
import { Project, ScanSummary } from '../types';

interface DashboardProps {
  projects: Project[];
  scans: ScanSummary[];
  onOpenUpload: () => void;
  onSelectScan: (scanId: number) => void;
  onNavigateTab: (tab: 'scans' | 'history') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  scans,
  onOpenUpload,
  onSelectScan,
  onNavigateTab
}) => {
  // Aggregate statistics
  const totalScans = scans.length;
  const totalFindings = scans.reduce((acc, s) => acc + s.total_findings, 0);
  const totalCritical = scans.reduce((acc, s) => acc + s.critical_count, 0);
  const totalHigh = scans.reduce((acc, s) => acc + s.high_count, 0);
  const totalFiles = scans.reduce((acc, s) => acc + s.total_files, 0);

  const recentScans = scans.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Executive Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Security &amp; Quality Overview
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Static analysis summary across repositories, vulnerability trends, and inspection engines.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigateTab('history')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit History</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Run New Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 transition-colors hover:border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Workspaces</span>
            <FolderGit2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2">
            {projects.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Configured project repositories
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 transition-colors hover:border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Audits Executed</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2">
            {totalScans}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalFiles.toLocaleString()} source files scanned
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 transition-colors hover:border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Critical Findings</span>
            <AlertTriangle className={`w-4 h-4 ${totalCritical > 0 ? 'text-rose-600' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className={`text-2xl font-semibold ${totalCritical > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {totalCritical}
            </span>
            <span className="text-[11px] text-slate-500">
              +{totalHigh} high severity
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalFindings} total issues detected
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 transition-colors hover:border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Analysis Engines</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2">
            3 Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Python AST &bull; Bandit &bull; Ruff
          </div>
        </div>
      </div>

      {/* Main Content: Recent Audits & Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Audits Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/75">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                Recent Security Audits
              </h2>
              <p className="text-[11px] text-slate-500">
                Latest static analysis runs across your workspaces
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentScans.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <FileCode className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-700 font-medium">No code scans recorded yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload a Python file or project archive to begin security analysis.
              </p>
              <button
                onClick={onOpenUpload}
                className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Scan</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentScans.map((scan) => {
                const projectName = projects.find((p) => p.id === scan.project_id)?.name || `Project #${scan.project_id}`;
                return (
                  <div
                    key={scan.id}
                    onClick={() => onSelectScan(scan.id)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-xs font-medium shrink-0 group-hover:border-blue-300 transition-colors">
                        #{scan.scan_number}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {projectName}
                          </span>
                          <span className="text-[10px] text-slate-600 font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {scan.scan_type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                          <span>{scan.total_files} files</span>
                          <span>&bull;</span>
                          <span>{scan.duration_seconds}s</span>
                          <span>&bull;</span>
                          <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 ml-3">
                      <div className="flex items-center space-x-1.5">
                        {scan.critical_count > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            {scan.critical_count} Crit
                          </span>
                        )}
                        {scan.high_count > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            {scan.high_count} High
                          </span>
                        )}
                        {scan.total_findings === 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Clean
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Registry (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/75">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                Workspaces
              </h2>
              <p className="text-[11px] text-slate-500">
                Active project environments
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              + New
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active projects found.
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-slate-900">
                      {proj.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID: {proj.id}
                    </span>
                  </div>

                  {proj.description && (
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                      {proj.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>{proj.scans_count} audits performed</span>
                    <button
                      onClick={onOpenUpload}
                      className="text-blue-600 hover:text-blue-700 font-sans font-medium text-[11px]"
                    >
                      Scan &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
