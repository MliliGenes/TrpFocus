import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Task, Subtask, toggleTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask, updateTaskTitle, updateSubtaskTitle } from '../store/tasksSlice';
import { RootState } from '../store/store';
import { Check, Trash2, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getTheme } from '../utils/theme';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch();
  const { mode, theme } = useSelector((state: RootState) => state.pomodoro);
  const currentThemeColor = mode === 'focus' ? theme.focusColor : theme.breakColor;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleAddSubtask = (e: FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      dispatch(addSubtask({ taskId: task.id, title: newSubtask }));
      setNewSubtask('');
    }
  };

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      dispatch(updateTaskTitle({ id: task.id, title: editTitle }));
    } else {
      setEditTitle(task.title); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-zinc-950 border-b border-zinc-900 group transition-all hover:bg-zinc-900/30`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => dispatch(toggleTask(task.id))}
            className={`w-6 h-6 flex items-center justify-center transition-colors border ${
              task.completed
                ? `bg-${currentThemeColor}-900/50 border-${currentThemeColor}-500 text-${currentThemeColor}-500`
                : `border-zinc-700 hover:border-${currentThemeColor}-500 text-transparent`
            }`}
          >
            {task.completed && <Check size={14} />}
          </button>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent border-b border-${currentThemeColor}-500 text-base font-mono text-${currentThemeColor}-100 focus:outline-none`}
              />
            ) : (
              <span 
                onClick={() => setIsEditing(true)}
                className={`text-base font-mono cursor-text block w-full ${task.completed ? 'text-zinc-600 line-through decoration-zinc-600' : `text-${currentThemeColor}-100 hover:text-white`}`}
              >
                {task.title}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 text-zinc-600 hover:text-${currentThemeColor}-400 transition-colors`}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            onClick={() => dispatch(deleteTask(task.id))}
            className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`pb-4 pl-14 pr-4 space-y-2`}>
              {task.subtasks.map((subtask) => (
                <SubtaskItem key={subtask.id} task={task} subtask={subtask} currentThemeColor={currentThemeColor} />
              ))}
              
              <form onSubmit={handleAddSubtask} className="flex items-center space-x-2 mt-3 pl-8">
                <span className="text-zinc-700 font-mono text-xs">|--</span>
                <Input
                  themeColor={currentThemeColor}
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask..."
                  className="h-8 text-sm bg-zinc-900 border-zinc-800"
                />
                <Button type="submit" size="sm" themeColor={currentThemeColor} disabled={!newSubtask.trim()} className="h-8 w-8 p-0">
                  <Plus size={14} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Extracted Subtask Item for cleaner code and separate edit state
const SubtaskItem: React.FC<{ task: Task, subtask: Subtask, currentThemeColor: string }> = ({ task, subtask, currentThemeColor }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      dispatch(updateSubtaskTitle({ taskId: task.id, subtaskId: subtask.id, title: editTitle }));
    } else {
      setEditTitle(subtask.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(subtask.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between group/sub"
    >
      <div className="flex items-center space-x-3 flex-1">
        <span className="text-zinc-700 font-mono text-xs">|--</span>
        <button
          onClick={() => dispatch(toggleSubtask({ taskId: task.id, subtaskId: subtask.id }))}
          className={`w-4 h-4 border flex items-center justify-center transition-colors ${
            subtask.completed
              ? `bg-${currentThemeColor}-900/50 border-${currentThemeColor}-500 text-${currentThemeColor}-500`
              : `border-zinc-700 hover:border-${currentThemeColor}-500 text-transparent`
          }`}
        >
          {subtask.completed && <Check size={10} />}
        </button>
        
        <div className="flex-1">
            {isEditing ? (
              <input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent border-b border-${currentThemeColor}-500 text-sm font-mono text-${currentThemeColor}-100 focus:outline-none`}
              />
            ) : (
              <span 
                onClick={() => setIsEditing(true)}
                className={`text-sm font-mono cursor-text block w-full ${subtask.completed ? 'text-zinc-600 line-through' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                {subtask.title}
              </span>
            )}
        </div>
      </div>
      <button
        onClick={() => dispatch(deleteSubtask({ taskId: task.id, subtaskId: subtask.id }))}
        className="opacity-0 group-hover/sub:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-all"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

