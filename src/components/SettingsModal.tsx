import React, { useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateConfig, updateTheme, PomodoroConfig, ThemeConfig } from '../store/pomodoroSlice';
import { importTasks } from '../store/tasksSlice';
import { X, Upload, Download, Clock, Palette, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { themeColors } from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'timer' | 'theme' | 'data';

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const dispatch = useDispatch();
  const { config, theme, mode } = useSelector((state: RootState) => state.pomodoro);
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const currentThemeColor = mode === 'focus' ? theme.focusColor : theme.breakColor;

  const [activeTab, setActiveTab] = useState<SettingsTab>('timer');
  const [localConfig, setLocalConfig] = useState<PomodoroConfig>(config);
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);

  const handleSave = () => {
    dispatch(updateConfig(localConfig));
    dispatch(updateTheme(localTheme));
    onClose();
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "focusflow_tasks.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            if (e.target?.result) {
                try {
                    const parsedTasks = JSON.parse(e.target.result as string);
                    dispatch(importTasks(parsedTasks));
                    alert('Tasks imported successfully!');
                } catch (error) {
                    alert('Invalid JSON file');
                }
            }
        };
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'timer', label: 'Timer', icon: Clock },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-zinc-950 border border-zinc-800 shadow-2xl w-full max-w-2xl h-[600px] pointer-events-auto flex flex-col md:flex-row overflow-hidden">
              
              {/* Sidebar */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-900 bg-zinc-950/50 p-4 flex flex-col">
                <div className="mb-8 pl-2">
                   <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest">Settings_</h2>
                </div>
                <nav className="space-y-2 flex-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-mono uppercase tracking-wider transition-all border-l-2 ${
                        activeTab === tab.id
                          ? `border-${currentThemeColor}-500 bg-${currentThemeColor}-900/20 text-${currentThemeColor}-400`
                          : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <tab.icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
                <div className="pt-4 border-t border-zinc-900">
                    <Button size="lg" themeColor={currentThemeColor} onClick={handleSave} className="w-full">
                        [ SAVE ]
                    </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto bg-zinc-950 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>

                <div className="mt-2">
                    {activeTab === 'timer' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <h3 className={`text-xs font-bold text-${currentThemeColor}-500 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-2`}>Timer Configuration</h3>
                            <div className="space-y-6">
                                <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Focus Duration (min)</label>
                                <Input
                                    type="number"
                                    value={localConfig.focusDuration}
                                    onChange={(e) => setLocalConfig({ ...localConfig, focusDuration: Number(e.target.value) })}
                                    themeColor={currentThemeColor}
                                />
                                </div>
                                <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Short Break Duration (min)</label>
                                <Input
                                    type="number"
                                    value={localConfig.shortBreakDuration}
                                    onChange={(e) => setLocalConfig({ ...localConfig, shortBreakDuration: Number(e.target.value) })}
                                    themeColor={currentThemeColor}
                                />
                                </div>
                                <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Long Break Duration (min)</label>
                                <Input
                                    type="number"
                                    value={localConfig.longBreakDuration}
                                    onChange={(e) => setLocalConfig({ ...localConfig, longBreakDuration: Number(e.target.value) })}
                                    themeColor={currentThemeColor}
                                />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'theme' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <h3 className={`text-xs font-bold text-${currentThemeColor}-500 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-2`}>Theme Configuration</h3>
                            <div className="space-y-8">
                                <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-3 uppercase">Focus Phase Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {themeColors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setLocalTheme({ ...localTheme, focusColor: c })}
                                        className={`w-8 h-8 border transition-all ${
                                        localTheme.focusColor === c 
                                            ? `bg-${c}-500 border-${c}-400 ring-2 ring-${c}-500 ring-offset-2 ring-offset-zinc-950` 
                                            : `bg-${c}-900/50 border-${c}-900 hover:border-${c}-700`
                                        }`}
                                    />
                                    ))}
                                </div>
                                </div>
                                <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-3 uppercase">Break Phase Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {themeColors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setLocalTheme({ ...localTheme, breakColor: c })}
                                        className={`w-8 h-8 border transition-all ${
                                        localTheme.breakColor === c 
                                            ? `bg-${c}-500 border-${c}-400 ring-2 ring-${c}-500 ring-offset-2 ring-offset-zinc-950` 
                                            : `bg-${c}-900/50 border-${c}-900 hover:border-${c}-700`
                                        }`}
                                    />
                                    ))}
                                </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'data' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <h3 className={`text-xs font-bold text-${currentThemeColor}-500 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-2`}>Data Management</h3>
                            <div className="space-y-4">
                                <div className="p-4 border border-zinc-900 bg-zinc-900/20">
                                    <p className="text-zinc-400 text-sm font-mono mb-4">Export your tasks to a JSON file for backup or transfer.</p>
                                    <Button variant="secondary" themeColor={currentThemeColor} onClick={handleExport} className="w-full">
                                        <Download size={16} className="mr-2" />
                                        EXPORT TASKS
                                    </Button>
                                </div>
                                <div className="p-4 border border-zinc-900 bg-zinc-900/20">
                                    <p className="text-zinc-400 text-sm font-mono mb-4">Import tasks from a previously exported JSON file.</p>
                                    <div className="relative w-full">
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleImport}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Button variant="secondary" themeColor={currentThemeColor} className="w-full">
                                            <Upload size={16} className="mr-2" />
                                            IMPORT TASKS
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

