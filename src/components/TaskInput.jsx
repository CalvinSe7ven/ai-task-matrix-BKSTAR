import React, { useState } from 'react';
import { Sparkles, Plus, Calendar, AlignLeft, Loader2, AlertCircle } from 'lucide-react';
import { ZONE_CONFIG } from '../types/task';

export default function TaskInput({ onAddTask, hasApiKey, onOpenKeyModal }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [manualZone, setManualZone] = useState('DO_NOW');
  const [useAI, setUseAI] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setErrorMsg('');

    if (useAI && !hasApiKey) {
      setErrorMsg('Vui lòng cấu hình Gemini API Key ở thanh Header để AI tự động phân loại, hoặc tắt chế độ AI để chọn thủ công.');
      onOpenKeyModal();
      return;
    }

    setLoading(true);

    let finalStart = startDate;
    let finalEnd = endDate;

    if (finalStart && !finalEnd) finalEnd = finalStart;
    if (!finalStart && finalEnd) finalStart = new Date().toISOString().slice(0, 16);

    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        startDate: finalStart,
        endDate: finalEnd,
        useAI,
        manualZone: manualZone || 'DO_NOW'
      });

      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setIsExpanded(false);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tạo công việc');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white border-2 border-gray-300 rounded-2xl p-4 shadow-md relative overflow-hidden transition-all duration-150 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/20"
      >
        {/* Main Title Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value && !isExpanded) setIsExpanded(true);
              }}
              onFocus={() => setIsExpanded(true)}
              placeholder="Nhập tên công việc mới (ví dụ: đọc sách, sửa bug...)"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-600 text-base font-bold transition"
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className={`px-5 py-3 rounded-xl text-sm font-extrabold transition flex items-center justify-center gap-2 shrink-0 shadow-md ${
                loading
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : !title.trim()
                  ? 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>AI đang phân loại...</span>
                </>
              ) : (
                <>
                  {useAI ? <Sparkles className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
                  <span>Thêm công việc</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description Input */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5">
                  <AlignLeft className="w-4 h-4 text-blue-600" />
                  Mô tả chi tiết (Tùy chọn)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả hoặc ghi chú (ví dụ: việc ko quan trọng, thư giãn...)"
                  rows="2"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 text-xs sm:text-sm transition resize-none"
                  disabled={loading}
                />
              </div>

              {/* Start Date & End Date Range Inputs */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Khoảng thời gian (Start Date → End Date)
                </label>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Bắt đầu</span>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-blue-600"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Kết thúc</span>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-blue-600"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Toggle & Manual Zone Selection */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setUseAI(!useAI)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black border-2 transition ${
                    useAI
                      ? 'bg-blue-100 text-blue-900 border-blue-400 shadow-xs'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${useAI ? 'text-amber-600 animate-pulse' : 'text-gray-400'}`} />
                  <span>{useAI ? '✨ Chế độ AI: Đang BẬT (Tự động phân loại)' : '⚙️ Chế độ AI: Đang TẮT (Chọn thủ công)'}</span>
                </button>

                {!useAI && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">Chọn ô:</span>
                    <select
                      value={manualZone}
                      onChange={(e) => setManualZone(e.target.value)}
                      className="px-3.5 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600"
                    >
                      {Object.values(ZONE_CONFIG).map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs font-bold text-gray-600 hover:text-gray-900 transition"
              >
                Thu gọn
              </button>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-between gap-2 text-xs font-bold text-red-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUseAI(false);
                setErrorMsg('');
              }}
              className="underline font-black text-red-950 hover:text-black"
            >
              Chuyển sang xếp thủ công
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
