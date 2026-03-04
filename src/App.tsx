import { Provider } from 'react-redux';
import { store } from './store/store';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { Header } from './components/Header';
import { QuoteSection } from './components/QuoteSection';
import { CRTOverlay } from './components/CRTOverlay';
import { RetroPet } from './components/RetroPet';

const AppContent = () => {
  const { mode, theme } = useSelector((state: RootState) => state.pomodoro);
  const currentThemeColor = mode === 'focus' ? theme.focusColor : theme.breakColor;

  return (
    <div
      className={`min-h-screen bg-zinc-950 transition-colors duration-0 overflow-hidden`}
    >
      <CRTOverlay />
      <div className="max-w-7xl mx-auto min-h-screen flex flex-col border-x border-zinc-900">
        <Header />
        
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Left Column: Timer & Quotes */}
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-900">
            <div className="flex-1 flex flex-col items-center justify-center py-8 gap-8">
                <Timer />
            </div>
            <QuoteSection />
          </div>

          {/* Right Column: Tasks */}
          <div className="lg:col-span-7 flex flex-col bg-zinc-950/50 h-full overflow-y-auto">
            <TaskList />
          </div>
        </main>
      </div>
      <RetroPet />
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
