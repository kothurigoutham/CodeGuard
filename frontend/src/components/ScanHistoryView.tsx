import React, { useState } from 'react';
import { History, GitCompare, Download, Eye, Trash2, Layers, Filter } from 'lucide-react';
import { ScanSummary, Project, ScanDiffResult } from '../types';
import { fetchScanDiff, deleteScan, getReportPdfUrl } from '../api';

interface ScanHistoryViewProps {
  scans: ScanSummary[];
  projects: Project[];
  onSelectScan: (scanId: number) => void;
  onRefresh: () => void;
  onOpenDiff: (diff: ScanDiffResult) => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  projects,
  onSelectScan,
  onRefresh,
  onOpenDiff
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'ALL'>('ALL');
  const [isComparing, setIsComparing] = useState(false);

  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  const filteredScans = scans.filter((s) => {
    return selectedProjectId === 'ALL' || s.project_id === selectedProjectId;
  });

  const handleCompareWithPrevious = async (currentScan: ScanSummary, idx: number) => {
    // Find the next older scan in the same project
    const previousScan = filteredScans.slice(idx + 1).find((s) => s.project_id === currentScan.project_id);
    if (!previousScan) {
      alert('No earlier baseline scan exists in this project to compare against.');
      return;
    }

    setIsComparing(true);
    try {
      const diffResult = await fetchScanDiff(currentScan.id, previousScan.id);
      setIsComparing(false);
      onOpenDiff(diffResult);
    } catch (err: any) {
      setIsComparing(false);
      alert(err.message || 'Failed to compare scans');
    }
  };

  const handleDelete = async (scanId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scan record?')) {
      await deleteScan(scanId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Audit History &amp; Comparisons</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Historical log of static security scans and comparative diffs against baselines.
          </p>
        </div>

        {/* Project Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="project-filter" className="text-xs text-slate-600 font-medium">Filter:</label>
          <div className="relative">
            <select
              id="project-filter"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm"
            >
              <option value="ALL">All Projects ({scans.length} scans)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredScans.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 shadow-sm">
          <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-800 font-medium">No audit logs found</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Upload new source code to generate your first audit record.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Audit</th>
                  <th className="px-4 py-3">Project Workspace</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Scope &amp; Runtime</th>
                  <th className="px-4 py-3">Vulnerabilities</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredScans.map((scan, idx) => {
                  const projectName = projectMap.get(scan.project_id) || `Project #${scan.project_id}`;
                  return (
                    <tr
                      key={scan.id}
                      onClick={() => onSelectScan(scan.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          Scan #{scan.scan_number}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ID: {scan.id} &bull; {scan.scan_type}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-800">
                        {projectName}
                      </td>

                      <td className="px-4 py-3 text-slate-600 text-[11px]">
                        {new Date(scan.created_at).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        <div>{scan.total_files} files</div>
                        <div className="text-[10px] text-slate-500 font-mono">{scan.duration_seconds}s execution</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1.5">
                          {scan.critical_count > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                              {scan.critical_count} Crit
                            </span>
                          )}
                          {scan.high_count > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              {scan.high_count} High
                            </span>
                          )}
                          {scan.medium_count > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
                              {scan.medium_count} Med
                            </span>
                          )}
                          {scan.low_count > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
                              {scan.low_count} Low
                            </span>
                          )}
                          {scan.total_findings === 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Clean
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleCompareWithPrevious(scan, idx)}
                            disabled={isComparing}
                            title="Compare with earlier baseline scan"
                            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={getReportPdfUrl(scan.id)}
                            download
                            title="Download PDF Audit Report"
                            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-rose-600" />
                          </a>

                          <button
                            onClick={() => onSelectScan(scan.id)}
                            title="Inspect Findings"
                            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDelete(scan.id, e)}
                            title="Delete Scan"
                            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
