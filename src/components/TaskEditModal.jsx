import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, Calendar, AlignLeft, LayoutGrid } from 'lucide-react';
import { ZONE_CONFIG } from '../types/task';

export default function TaskEditModal({ task, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [matrixZone, setMatrixZone] = useState('DO_NOW');
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStartDate(task.start_date || '');
      setEndDate(task.end_date || task.deadline || '');
      setMatrixZone(task.matrix_zone || 'DO_NOW');
      setStatus(task.status || 'PENDING');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalStart = startDate;
    let finalEnd = endDate;

    if (finalStart && !finalEnd) finalEnd = finalStart;
    if (!finalStart && finalEnd) finalStart = finalEnd;

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      start_date: finalStart,
      end_date: finalEnd,
      deadline: finalEnd,
      matrix_zone: matrixZone,
      status
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 border-2 border-blue-300 rounded-xl text-blue-800">
              <Edit3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Chỉnh sửa công việc</h3>
              <p className="text-xs font-bold text-gray-600">Cập nhật thông tin và khoảng thời gian</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Tên công việc <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-bold text-sm focus:outline-none focus:bg-white focus:border-blue-600"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5">
              <AlignLeft className="w-4 h-4 text-blue-600" />
              Mô tả chi tiết
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-blue-600 resize-none"
            />
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Thời gian kết thúc (End Date)
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                Ô Ma trận (Eisenhower Zone)
              </label>
              <select
                value={matrixZone}
                onChange={(e) => setMatrixZone(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-bold text-xs focus:outline-none focus:bg-white focus:border-blue-600"
              >
                {Object.values(ZONE_CONFIG).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Trạng thái</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('PENDING')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-black border-2 transition ${
                    status === 'PENDING'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
                >
                  Đang xử lý
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('COMPLETED')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-black border-2 transition ${
                    status === 'COMPLETED'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
