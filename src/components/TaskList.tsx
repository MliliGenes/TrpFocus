import React, { useState, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addTask } from '../store/tasksSlice';
import { TaskItem } from './TaskItem';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const { mode, theme } = useSelector((state: RootState) => state.pomodoro);
  const currentThemeColor = mode === 'focus' ? theme.focusColor : theme.breakColor;
  
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      dispatch(addTask(newTask));
      setNewTask('');
    }
  };

  return (
    <div className="w-full h-full p-6">
      <div className={`border-b border-${currentThemeColor}-900/50 mb-6 pb-2 flex items-center justify-between`}>
        <h2 className={`text-${currentThemeColor}-500 font-mono uppercase tracking-widest text-sm`}>// Tasks_</h2>
        <span className="text-zinc-600 font-mono text-xs">{tasks.length} Active</span>
      </div>

      <form onSubmit={handleAddTask} className="flex space-x-2 mb-8">
        <Input
          themeColor={currentThemeColor}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="> Add new task..."
          className="h-12 text-base shadow-none bg-zinc-950"
        />
        <Button
          type="submit"
          size="lg"
          themeColor={currentThemeColor}
          disabled={!newTask.trim()}
          className="shadow-none h-12 w-12 px-0"
        >
          <Plus />
        </Button>
      </form>

      <div className="space-y-0 border-t border-zinc-900">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className={`text-center py-12 border-b border-zinc-900 border-dashed`}>
            <p className={`text-${currentThemeColor}-900/50 font-mono`}>[ No tasks active ]</p>
          </div>
        )}
      </div>
    </div>
  );
};
