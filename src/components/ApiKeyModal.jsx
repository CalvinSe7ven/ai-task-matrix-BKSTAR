import React, { useState } from 'react';
import { Key, ExternalLink, X, Check, ShieldAlert } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSave }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(keyInput);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cấu hình Gemini API Key</h3>
              <p className="text-xs text-slate-500">Tự động phân loại công việc bằng AI `gemini-2.5-flash`</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Gemini API Key của bạn
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
            />
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              API Key được lưu an toàn trong localStorage của trình duyệt cá nhân.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-blue-900">Cách lấy API Key miễn phí:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Truy cập vào <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">Google AI Studio <ExternalLink className="w-3 h-3 inline" /></a></li>
              <li>Bấm nút <strong>Create API Key</strong></li>
              <li>Sao chép mã Key và dán vào ô bên trên</li>
            </ol>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Đã lưu!
                </>
              ) : (
                'Lưu API Key'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
