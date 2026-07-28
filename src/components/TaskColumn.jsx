import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { AlertTriangle, Calendar, Zap, Archive, Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const ICON_MAP = {
  AlertTriangle,
  Calendar,
  Zap,
  Archive
};

export default function TaskColumn({ 
  zoneConfig, 
  tasks, 
  onToggleStatus, 
  onDeleteTask, 
  onEditTask,
  onQuickAdd 
}) {
  const IconComponent = ICON_MAP[zoneConfig.icon] || Calendar;

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl border-2 ${zoneConfig.borderColor} overflow-hidden shadow-md transition-all duration-150`}>
      {/* Column Header */}
      <div className={`p-4 border-b-2 ${zoneConfig.headerBg}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border-2 ${zoneConfig.badgeBg}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 flex items-center gap-2">
                {zoneConfig.title}
              </h3>
              <p className="text-xs font-bold text-gray-700">
                {zoneConfig.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-black border-2 ${zoneConfig.badgeBg}`}>
              {tasks.length}
            </span>
            <button
              onClick={() => onQuickAdd(zoneConfig.id)}
              className="p-2 rounded-xl text-gray-700 hover:text-gray-950 hover:bg-white/90 border border-transparent hover:border-gray-300 shadow-xs transition"
              title="Thêm nhanh vào cột này"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Droppable Task List Area */}
      <Droppable droppableId={zoneConfig.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3.5 overflow-y-auto min-h-[240px] transition-all duration-200 ${
              snapshot.isDraggingOver
                ? 'bg-blue-100/70 ring-4 ring-blue-500/30 scale-[1.005] border-blue-500'
                : 'bg-gray-50/40'
            }`}
          >
            {tasks.length === 0 ? (
              <div className={`h-full min-h-[180px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center transition ${
                snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50/80' : 'border-gray-300'
              }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 opacity-75 ${zoneConfig.badgeBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-gray-700">Chưa có công việc nào</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Kéo thả hoặc thêm công việc mới vào đây</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggleStatus={onToggleStatus}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
