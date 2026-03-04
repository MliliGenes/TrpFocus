import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: number;
}

interface TasksState {
  items: Task[];
}

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: uuidv4(),
        title: action.payload,
        completed: false,
        subtasks: [],
        createdAt: Date.now(),
      });
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    addSubtask: (state, action: PayloadAction<{ taskId: string; title: string }>) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks.push({
          id: uuidv4(),
          title: action.payload.title,
          completed: false,
        });
      }
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        const subtask = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
        }
      }
    },
    deleteSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks = task.subtasks.filter((s) => s.id !== action.payload.subtaskId);
      }
    },
    updateTaskTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    },
    updateSubtaskTitle: (state, action: PayloadAction<{ taskId: string; subtaskId: string; title: string }>) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        const subtask = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (subtask) {
          subtask.title = action.payload.title;
        }
      }
    },
    importTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
        state.items = action.payload;
    }
  },
});

export const {
  addTask,
  toggleTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  updateTaskTitle,
  updateSubtaskTitle,
  importTasks,
  reorderTasks
} = tasksSlice.actions;

export default tasksSlice.reducer;
