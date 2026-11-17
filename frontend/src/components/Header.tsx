import React from 'react';
import { Shield, Plus, LayoutDashboard, Search, History } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'scans' | 'history';
  onTabChange: (tab: 'dashboard' | 'scans' | 'history') => void;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onOpenUpload }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0B0F19]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center space-x-2.5 text-left group focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-md bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:border-blue-500/40 transition-colors">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-tight text-slate-100">
                  CodeGuard
                </span>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 border border-slate-750 px-1.5 py-0.5 rounded">
                  SAST
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 p-0.5 bg-slate-900/60 border border-slate-800/80 rounded-lg">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onTabChange('scans')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentTab === 'scans'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Scan Explorer</span>
              </button>

              <button
                onClick={() => onTabChange('history')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentTab === 'history'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History &amp; Diff</span>
              </button>
            </nav>
          </div>

          {/* Action Button & System Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 font-mono px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-slate-400">Engines: AST &bull; Bandit &bull; Ruff</span>
            </div>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-colors border border-blue-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
