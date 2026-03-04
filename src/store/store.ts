import { configureStore, Middleware, combineReducers } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import pomodoroReducer from './pomodoroSlice';

// Middleware to save to localStorage
const localStorageMiddleware: Middleware<{}, any> = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem('focusFlowState', JSON.stringify(state));
  return result;
};

// Load from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('focusFlowState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const rootReducer = combineReducers({
  tasks: tasksReducer,
  pomodoro: pomodoroReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
