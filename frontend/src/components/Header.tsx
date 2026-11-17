import React from 'react';
import { Shield, Plus, LayoutDashboard, Search, History } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'scans' | 'history';
  onTabChange: (tab: 'dashboard' | 'scans' | 'history') => void;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onOpenUpload }) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center space-x-2.5 text-left group focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:border-blue-300 transition-colors">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  CodeGuard
                </span>
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                  SAST
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 p-0.5 bg-slate-100 border border-slate-200/80 rounded-lg">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onTabChange('scans')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentTab === 'scans'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Scan Explorer</span>
              </button>

              <button
                onClick={() => onTabChange('history')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  currentTab === 'history'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History &amp; Diff</span>
              </button>
            </nav>
          </div>

          {/* Action Button & System Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-600 font-mono px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-slate-600">Engines: AST &bull; Bandit &bull; Ruff</span>
            </div>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors"
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
