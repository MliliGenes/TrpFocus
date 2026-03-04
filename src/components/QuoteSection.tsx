import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useQuotes } from '../hooks/useQuotes';
import { Quote as QuoteIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuoteSection = () => {
  const { mode, theme } = useSelector((state: RootState) => state.pomodoro);
  const currentThemeColor = mode === 'focus' ? theme.focusColor : theme.breakColor;
  const { quote, loading } = useQuotes(10); // Refresh every 10 minutes

  return (
    <div className={`border-t border-zinc-900 p-6 mt-auto`}>
      <div className="flex items-center space-x-2 mb-4">
        <QuoteIcon size={16} className={`text-${currentThemeColor}-500`} />
        <span className={`text-xs font-mono uppercase tracking-widest text-${currentThemeColor}-500`}>Random Quote</span>
      </div>
      
      <div className="min-h-[100px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className={`animate-spin text-${currentThemeColor}-500`} />
            </motion.div>
          ) : quote ? (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-zinc-300 font-mono text-sm mb-3 leading-relaxed">"{quote.quote}"</p>
              <p className={`text-${currentThemeColor}-400 text-xs font-mono uppercase tracking-wider`}>— {quote.author}</p>
            </motion.div>
          ) : (
             <p className="text-zinc-600 text-xs font-mono">Waiting for inspiration...</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
