import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CheckCircle2, Circle, Clock, Trash2, Edit3, AlertCircle, GripVertical, CalendarRange } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskCard({ task, index, onToggleStatus, onDeleteTask, onEditTask }) {
  const isCompleted = task.status === 'COMPLETED';

  // Compute Date Range & Deadline status
  const getDateRangeInfo = () => {
    const startDateStr = task.start_date || task.deadline || '';
    const endDateStr = task.end_date || task.deadline || '';

    if (!startDateStr && !endDateStr) return null;

    const startObj = startDateStr ? new Date(startDateStr) : null;
    const endObj = endDateStr ? new Date(endDateStr) : null;
    const now = new Date();

    const formatTime = (d) => {
      if (!d || isNaN(d.getTime())) return '';
      const dayName = d.toLocaleDateString('vi-VN', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `${dayName} ${dayNum}/${monthNum} ${timeStr}`;
    };

    let isMultiDay = false;
    let daysSpan = 1;
    if (startObj && endObj && !isNaN(startObj.getTime()) && !isNaN(endObj.getTime())) {
      const diffTime = Math.abs(endObj - startObj);
      daysSpan = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      isMultiDay = startObj.toDateString() !== endObj.toDateString();
    }

    let isOverdue = false;
    if (endObj && !isNaN(endObj.getTime()) && endObj < now && !isCompleted) {
      isOverdue = true;
    }

    let badgeClass = 'bg-gray-100 text-gray-800 border-2 border-gray-300 font-semibold';
    if (isOverdue) {
      badgeClass = 'bg-red-100 text-red-900 border-2 border-red-300 font-bold';
    } else if (isMultiDay) {
      badgeClass = 'bg-blue-100 text-blue-900 border-2 border-blue-300 font-bold';
    }

    return {
      startText: formatTime(startObj),
      endText: formatTime(endObj),
      isMultiDay,
      daysSpan,
      isOverdue,
      badgeClass
    };
  };

  const rangeInfo = getDateRangeInfo();

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {}
    }
    onToggleStatus(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEditTask(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDeleteTask(task.id);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group bg-white rounded-xl p-4 mb-3 border-2 transition-all duration-150 shadow-md select-none ${
            snapshot.isDragging
              ? 'border-blue-600 shadow-2xl scale-[1.03] rotate-1 bg-white z-50 ring-4 ring-blue-500/30'
              : isCompleted
              ? 'border-gray-300 bg-gray-50/90 shadow-sm opacity-90'
              : 'border-gray-300 hover:border-blue-500 hover:shadow-lg'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Interactive Drag Handle (6-dots Grip) */}
            <div
              {...provided.dragHandleProps}
              className="mt-0.5 text-gray-500 hover:text-gray-900 cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition shrink-0 flex items-center justify-center"
              title="Kéo thả để di chuyển ô ma trận"
            >
              <GripVertical className="w-5 h-5 stroke-[2.5]" />
            </div>

            {/* Checkbox */}
            <button
              type="button"
              onClick={handleToggle}
              className="mt-0.5 text-gray-400 hover:text-blue-600 transition shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 stroke-[2.2]" />
              )}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-base sm:text-lg font-bold leading-snug break-words transition ${
                isCompleted ? 'line-through text-gray-600' : 'text-gray-900'
              }`}>
                {task.title}
              </h4>

              {task.description && (
                <p className={`mt-1 text-xs sm:text-sm font-medium break-words line-clamp-2 ${
                  isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Date Range Badge */}
              {rangeInfo && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${rangeInfo.badgeClass}`}>
                    {rangeInfo.isOverdue ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    ) : rangeInfo.isMultiDay ? (
                      <CalendarRange className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                    )}

                    <span>
                      {rangeInfo.isMultiDay
                        ? `${rangeInfo.startText} → ${rangeInfo.endText}`
                        : rangeInfo.endText || rangeInfo.startText}
                    </span>
                  </span>

                  {rangeInfo.isMultiDay && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-[11px] font-bold">
                      Kéo dài {rangeInfo.daysSpan} ngày
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
              <button
                type="button"
                onClick={handleEdit}
                className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
                title="Sửa công việc"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                title="Xóa công việc"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
