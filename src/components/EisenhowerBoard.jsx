import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ZONE_CONFIG } from '../types/task';
import TaskColumn from './TaskColumn';

export default function EisenhowerBoard({ 
  tasks, 
  onDragEnd, 
  onToggleStatus, 
  onDeleteTask, 
  onEditTask,
  onQuickAdd 
}) {
  const getTasksByZone = (zoneId) => {
    return tasks.filter((t) => t.matrix_zone === zoneId);
  };

  const zonesList = [
    ZONE_CONFIG.DO_NOW,
    ZONE_CONFIG.PLAN,
    ZONE_CONFIG.DELEGATE,
    ZONE_CONFIG.BACKLOG,
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
          {zonesList.map((zone) => (
            <TaskColumn
              key={zone.id}
              zoneConfig={zone}
              tasks={getTasksByZone(zone.id)}
              onToggleStatus={onToggleStatus}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
