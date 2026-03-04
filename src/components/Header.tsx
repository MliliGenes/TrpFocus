import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useTime } from '../hooks/useTime';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export const Header = () => {
  const time = useTime(10); // Update every 10ms for smooth ms display
  const { mode, theme } = useSelector((state: RootState) => state.pomodoro);
  const currentThemeColor = mode === 'focus' ? theme.focusColor : theme.breakColor;
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 bg-${currentThemeColor}-500 animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)] shadow-${currentThemeColor}-500/50`} />
          <span className={`text-xl font-bold text-${currentThemeColor}-500 tracking-wider font-mono uppercase`}>Trp_Focus_</span>
        </div>
        
        <div className="hidden md:block">
          <span className={`text-zinc-500 font-mono text-lg tracking-widest`}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            <span className={`text-${currentThemeColor}-900 text-sm ml-1`}>
                .{Math.floor(time.getMilliseconds() / 10).toString().padStart(2, '0')}
            </span>
          </span>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 text-${currentThemeColor}-500 hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800`}
        >
          <SettingsIcon />
        </button>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
