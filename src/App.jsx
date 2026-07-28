import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import CalendarFocusSection from './components/CalendarFocusSection';
import FilterBar from './components/FilterBar';
import EisenhowerBoard from './components/EisenhowerBoard';
import ApiKeyModal from './components/ApiKeyModal';
import TaskEditModal from './components/TaskEditModal';
import { storageService } from './services/storage';
import { classifyTaskWithGemini } from './services/gemini';

export default function App() {
  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [apiKey, setApiKey] = useState(() => storageService.getApiKey());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Persist tasks whenever changed
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  // Persist API key
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    storageService.saveApiKey(newKey);
  };

  // Add Task handler supporting AI zone classification + Natural Language Date Extraction
  const handleAddTask = async ({ title, description, startDate, endDate, useAI, manualZone }) => {
    let zone = manualZone || 'DO_NOW';
    let finalStart = startDate;
    let finalEnd = endDate;

    if (useAI) {
      if (!apiKey) {
        setIsKeyModalOpen(true);
        throw new Error('Cần có Gemini API Key để tự động phân loại.');
      }
      
      try {
        const aiRes = await classifyTaskWithGemini({
          title,
          description,
          startDate: finalStart,
          endDate: finalEnd,
          apiKey
        });

        if (aiRes && typeof aiRes === 'object') {
          zone = aiRes.matrixZone || manualZone || 'DO_NOW';
          if (aiRes.startDate && (!finalStart || finalStart === '')) {
            finalStart = aiRes.startDate;
          }
          if (aiRes.endDate && (!finalEnd || finalEnd === '')) {
            finalEnd = aiRes.endDate;
          }
        } else if (typeof aiRes === 'string') {
          zone = aiRes;
        }
      } catch (err) {
        console.warn('Lỗi gọi AI Gemini, dùng mặc định:', err);
        zone = manualZone || 'DO_NOW';
      }
    }

    if (finalStart && !finalEnd) finalEnd = finalStart;
    if (!finalStart && finalEnd) finalStart = finalEnd;

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title,
      description,
      start_date: finalStart,
      end_date: finalEnd,
      deadline: finalEnd,
      matrix_zone: zone,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  // Drag & drop handler
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setTasks((prevTasks) => {
      const taskToMove = prevTasks.find((t) => t.id === draggableId);
      if (!taskToMove) return prevTasks;

      const remainingTasks = prevTasks.filter((t) => t.id !== draggableId);

      const updatedTask = {
        ...taskToMove,
        matrix_zone: destination.droppableId
      };

      const destZoneTasks = remainingTasks.filter((t) => t.matrix_zone === destination.droppableId);
      destZoneTasks.splice(destination.index, 0, updatedTask);

      const otherZoneTasks = remainingTasks.filter((t) => t.matrix_zone !== destination.droppableId);

      return [...destZoneTasks, ...otherZoneTasks];
    });
  };

  // Task actions
  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : t
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSaveEditedTask = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  const handleQuickAdd = (zoneId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Stats calculation
  const now = new Date();
  
  const overdueCount = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status === 'COMPLETED') return false;
      const endStr = t.end_date || t.deadline;
      if (!endStr) return false;
      return new Date(endStr) < now;
    }).length;
  }, [tasks, now]);

  const dueSoonCount = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status === 'COMPLETED') return false;
      const endStr = t.end_date || t.deadline;
      if (!endStr) return false;
      const due = new Date(endStr);
      const diffHours = (due - now) / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= 24;
    }).length;
  }, [tasks, now]);

  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.status === 'COMPLETED').length;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Calendar Date Range Filter
      if (selectedCalendarDate) {
        let start = t.start_date ? t.start_date.slice(0, 10) : (t.end_date || t.deadline || '').slice(0, 10);
        let end = t.end_date ? t.end_date.slice(0, 10) : (t.start_date || t.deadline || '').slice(0, 10);

        if (!start && !end) return false;
        if (!start) start = end;
        if (!end) end = start;

        if (start > end) {
          const tmp = start;
          start = end;
          end = tmp;
        }

        if (selectedCalendarDate < start || selectedCalendarDate > end) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = t.title?.toLowerCase().includes(query);
        const matchDesc = t.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      // Status / Category filter
      if (currentFilter === 'COMPLETED') return t.status === 'COMPLETED';
      if (currentFilter === 'OVERDUE') {
        if (t.status === 'COMPLETED') return false;
        const endStr = t.end_date || t.deadline;
        if (!endStr) return false;
        return new Date(endStr) < now;
      }
      if (currentFilter === 'DUE_SOON') {
        if (t.status === 'COMPLETED') return false;
        const endStr = t.end_date || t.deadline;
        if (!endStr) return false;
        const due = new Date(endStr);
        const diffHours = (due - now) / (1000 * 60 * 60);
        return diffHours >= 0 && diffHours <= 24;
      }
      return true;
    });
  }, [tasks, selectedCalendarDate, currentFilter, searchQuery, now]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* App Header */}
      <Header
        hasApiKey={Boolean(apiKey)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Fast Task Input Bar */}
        <TaskInput
          onAddTask={handleAddTask}
          hasApiKey={Boolean(apiKey)}
          onOpenKeyModal={() => setIsKeyModalOpen(true)}
        />

        {/* 2-Column Split View: Compact Mini Calendar (40%) + Today's Focus List (60%) */}
        <CalendarFocusSection
          tasks={tasks}
          selectedDate={selectedCalendarDate}
          onSelectDate={setSelectedCalendarDate}
          onToggleStatus={handleToggleStatus}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={tasks.length}
          overdueCount={overdueCount}
          dueSoonCount={dueSoonCount}
          completedCount={completedCount}
        />

        {/* Eisenhower 4-Quadrant Board */}
        <EisenhowerBoard
          tasks={filteredTasks}
          onDragEnd={handleDragEnd}
          onToggleStatus={handleToggleStatus}
          onDeleteTask={handleDeleteTask}
          onEditTask={setEditingTask}
          onQuickAdd={handleQuickAdd}
        />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-300 py-6 text-center text-xs font-bold text-gray-700 bg-white">
        <p>AI Task Matrix • Natural Language Date Extraction & Eisenhower 4-Zone Matrix with Gemini AI</p>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSave={handleSaveApiKey}
      />

      <TaskEditModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
      />
    </div>
  );
}
