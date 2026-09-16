import React, { useState } from 'react';
import {
  FileCode,
  Database,
  Copy,
  Check,
  Download,
  Server,
  ShieldCheck,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { PHP_ARCHITECTURE_FILES, PhpFile } from '../data/phpArchitectureData';

export const PhpCodeViewer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(PHP_ARCHITECTURE_FILES[0].path);
  const [copied, setCopied] = useState(false);

  const selectedFile: PhpFile =
    PHP_ARCHITECTURE_FILES.find((f) => f.path === selectedFilePath) || PHP_ARCHITECTURE_FILES[0];

  const sqlFile = PHP_ARCHITECTURE_FILES.find((f) => f.filename === 'connecta.sql');
  const sqlContent = sqlFile ? sqlFile.code : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = [
    { label: 'Database Schema', category: 'database' },
    { label: 'Configuration & Security', category: 'config' },
    { label: 'Classes & Business Logic', category: 'includes' },
    { label: 'Controllers & Actions', category: 'actions' },
    { label: 'Views & Pages', category: 'pages' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1877F2]/20 text-[#1877F2] rounded-full text-xs font-semibold mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>PHP 8.2+ & MySQL 8.0 Full Backend Architecture</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Backend Source & SQL Schema</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Complete, production-ready PHP architecture with PDO prepared statements, CSRF protection tokens, XSS escaping, bcrypt password hashing, and clean relational normalization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const blob = new Blob([sqlContent], { type: 'application/sql' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'connecta_mysql_schema.sql';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-[#1877F2] hover:bg-[#145DBF] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download connecta.sql</span>
          </button>
        </div>
      </div>

      {/* Main File Browser & Code Display Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[620px]">
        {/* Left Sidebar: File Tree */}
        <div className="w-full md:w-80 border-r border-gray-200 bg-gray-50/70 p-4 shrink-0 flex flex-col">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">
            Project Files ({PHP_ARCHITECTURE_FILES.length})
          </span>

          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {categories.map((cat) => {
              const filesInCat = PHP_ARCHITECTURE_FILES.filter((f) => f.category === cat.category);
              if (filesInCat.length === 0) return null;
              return (
                <div key={cat.label} className="space-y-1">
                  <div className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5 px-1">
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span>{cat.label}</span>
                  </div>
                  <div className="space-y-0.5 pl-2">
                    {filesInCat.map((f) => {
                      const isSelected = f.path === selectedFilePath;
                      return (
                        <button
                          key={f.path}
                          onClick={() => setSelectedFilePath(f.path)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1877F2] text-white shadow-xs'
                              : 'text-gray-700 hover:bg-gray-200/60'
                          }`}
                        >
                          {f.category === 'database' ? (
                            <Database className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <FileCode className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{f.path}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="flex-1 flex flex-col bg-slate-950 text-slate-200">
          {/* File Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Code2 className="w-4 h-4 text-[#1877F2]" />
              <span className="font-mono text-xs font-bold text-slate-100 truncate">
                {selectedFile.path}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                — {selectedFile.description}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadFile}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Download this file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed max-h-[600px] select-text">
            <pre className="text-slate-300 whitespace-pre font-mono">
              {selectedFile.code}
            </pre>
          </div>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">InnoDB & Foreign Keys</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Full relational schema with <code className="text-[#1877F2] font-semibold">ON DELETE CASCADE</code>, strict index optimization on <code className="text-gray-800 font-mono">user_id</code> and <code className="text-gray-800 font-mono">created_at</code>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">CSRF & Prepared Statements</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Zero SQL injection risk via standard PDO parameterized queries. Synchronizer token pattern with timing-attack resistant <code className="text-gray-800 font-mono">hash_equals()</code> validation.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">AJAX & Fetch API</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Clean JSON response wrappers for asynchronous interactions like instant emoji reactions, comment posting, and real-time messaging without full page reloads.
          </p>
        </div>
      </div>
    </div>
  );
};
