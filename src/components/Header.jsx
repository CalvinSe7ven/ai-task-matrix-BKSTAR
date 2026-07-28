import React from 'react';
import { Calendar, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ hasApiKey, onOpenKeyModal }) {
  return (
    <header className="w-full bg-white border-b-2 border-gray-300 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-md text-white flex items-center justify-center">
            <Calendar className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                AI Task Matrix
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-black bg-blue-100 text-blue-900 border-2 border-blue-300 rounded-full uppercase tracking-wider">
                Google Edition
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              Quản lý công việc ma trận Eisenhower tự động phân loại bằng AI Gemini
            </p>
          </div>
        </div>

        {/* Key Status Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 transition-all duration-150 ${
              hasApiKey
                ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                : 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200 animate-pulse'
            }`}
          >
            <Key className="w-4 h-4" />
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Gemini AI Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Cấu hình API Key</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
