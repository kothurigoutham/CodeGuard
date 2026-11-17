import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ScanDetailView } from './components/ScanDetailView';
import { ScanHistoryView } from './components/ScanHistoryView';
import { ScanUploadModal } from './components/ScanUploadModal';
import { ScanDiffModal } from './components/ScanDiffModal';
import { Project, ScanSummary, ScanDetail, ScanDiffResult } from './types';
import { fetchProjects, fetchScans, fetchScanDetail } from './api';
import { Search, Loader2, ShieldCheck, Plus } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'scans' | 'history'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [scans, setScans] = useState<ScanSummary[]>([]);
  
  const [selectedScanDetail, setSelectedScanDetail] = useState<ScanDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [diffModalData, setDiffModalData] = useState<ScanDiffResult | null>(null);

  // Load initial projects & scans
  const loadData = async () => {
    try {
      const [projList, scanList] = await Promise.all([
        fetchProjects(),
        fetchScans()
      ]);
      setProjects(projList);
      setScans(scanList);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectScan = async (scanId: number) => {
    setIsLoadingDetail(true);
    try {
      const detail = await fetchScanDetail(scanId);
      setSelectedScanDetail(detail);
      setCurrentTab('scans');
    } catch (err) {
      console.error('Failed to load scan detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleScanComplete = (newScan: ScanDetail) => {
    setSelectedScanDetail(newScan);
    setCurrentTab('scans');
    loadData();
  };

  const handleRefreshScan = async () => {
    if (selectedScanDetail) {
      const updated = await fetchScanDetail(selectedScanDetail.id);
      setSelectedScanDetail(updated);
    }
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'dashboard' || tab === 'history') {
            setSelectedScanDetail(null);
          }
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            projects={projects}
            scans={scans}
            onOpenUpload={() => setIsUploadOpen(true)}
            onSelectScan={handleSelectScan}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'scans' && (
          <>
            {isLoadingDetail ? (
              <div className="py-24 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">Loading audit findings and source manifest...</p>
              </div>
            ) : selectedScanDetail ? (
              <ScanDetailView
                scan={selectedScanDetail}
                projectName={projects.find((p) => p.id === selectedScanDetail.project_id)?.name}
                onBack={() => {
                  setSelectedScanDetail(null);
                  setCurrentTab('dashboard');
                }}
                onRefreshScan={handleRefreshScan}
              />
            ) : (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Select an Audit to Inspect Findings</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  Pick an existing scan from the dashboard or history, or upload new source code.
                </p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-colors border border-blue-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Scan</span>
                </button>
              </div>
            )}
          </>
        )}

        {currentTab === 'history' && (
          <ScanHistoryView
            scans={scans}
            projects={projects}
            onSelectScan={handleSelectScan}
            onRefresh={loadData}
            onOpenDiff={(diff) => setDiffModalData(diff)}
          />
        )}
      </main>

      {/* Upload Modal */}
      <ScanUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        projects={projects}
        onScanComplete={handleScanComplete}
        onProjectCreated={(newP) => setProjects([newP, ...projects])}
      />

      {/* Diff Comparison Modal */}
      <ScanDiffModal
        isOpen={Boolean(diffModalData)}
        onClose={() => setDiffModalData(null)}
        diffData={diffModalData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">CodeGuard</span>
            <span>&bull;</span>
            <span>Static Application Security Testing &amp; Quality</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Engines: Python AST &bull; Bandit SAST &bull; Ruff Linter &bull; ReportLab
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
