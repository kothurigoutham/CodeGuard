import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileCode, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Project, ScanDetail } from '../types';
import { uploadScan, createProject } from '../api';

interface ScanUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onScanComplete: (scan: ScanDetail) => void;
  onProjectCreated: (newProj: Project) => void;
}

export const ScanUploadModal: React.FC<ScanUploadModalProps> = ({
  isOpen,
  onClose,
  projects,
  onScanComplete,
  onProjectCreated
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'py' && ext !== 'zip') {
      setErrorMsg('Invalid file format. Please upload a .py file or a .zip project archive.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File exceeds 25 MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleStartScan = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a Python file or ZIP archive to scan.');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);

    try {
      let targetProjectId = selectedProjectId;

      // Create new project if selected
      if (isCreatingNewProject) {
        if (!newProjectName.trim()) {
          setErrorMsg('Please specify a name for the new project.');
          setIsScanning(false);
          return;
        }
        const createdProj = await createProject(newProjectName.trim(), newProjectDesc.trim());
        onProjectCreated(createdProj);
        targetProjectId = createdProj.id;
      }

      const scanResult = await uploadScan(targetProjectId, selectedFile);
      setIsScanning(false);
      onScanComplete(scanResult);
      onClose();
    } catch (err: any) {
      setIsScanning(false);
      setErrorMsg(err.message || 'An error occurred during static analysis.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Run Static Code Scan
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Upload source code to execute AST, Bandit SAST, and Ruff analysis.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isScanning}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-850 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="flex items-start space-x-2.5 p-3 rounded-md bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Project Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="target-project-select" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Target Workspace
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingNewProject(!isCreatingNewProject)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isCreatingNewProject ? 'Choose Existing' : '+ New Workspace'}
              </button>
            </div>

            {!isCreatingNewProject ? (
              <select
                id="target-project-select"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                className="w-full bg-[#090D16] border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.scans_count > 0 ? `(${p.scans_count} scans)` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2 bg-[#090D16] p-3 rounded-md border border-slate-800">
                <input
                  type="text"
                  placeholder="Project Name (e.g., Payment Gateway Service)"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-750 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Optional description"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-750 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* File Upload Drop Zone */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Source Code File (.py) or Archive (.zip)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".py,.zip"
              className="hidden"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/5'
                  : selectedFile
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-750 hover:border-slate-600 bg-[#090D16]/50'
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{selectedFile.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready to Analyze
                  </div>
                  <span className="text-[11px] text-blue-400 hover:underline pt-1">
                    Click to replace file
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="w-8 h-8 rounded bg-slate-800 text-slate-400 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-medium text-slate-200">
                    Click to browse or drag file here
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Accepts standalone <code className="font-mono text-slate-400">.py</code> or complete <code className="font-mono text-slate-400">.zip</code> (max 25 MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#090D16] rounded-md p-3 border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
            <div className="font-medium text-slate-300">Safety Guarantee:</div>
            <div>&bull; Static analysis only. Code is <strong className="text-slate-200">never executed</strong>.</div>
            <div>&bull; Multi-engine parsing via Python AST, Bandit SAST, and Ruff.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 px-5 py-3.5 bg-[#090D16] border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isScanning}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartScan}
            disabled={isScanning || !selectedFile}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-colors border border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Code...</span>
              </>
            ) : (
              <span>Start Analysis</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
