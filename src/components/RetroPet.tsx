import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { motion, AnimatePresence } from 'motion/react';

// ─── Sprites ────────────────────────────────────────────────────────────────
// Each entry is an 8×8 grid: 0 = off, 1 = on

type Sprite = number[][];

const SPRITES: Record<string, Sprite> = {
  idle: [
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  blink: [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  focus: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  break: [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  happy: [
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,1,1,0,0,1,1,0],
    [0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  sad: [
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
};

// ─── Messages ────────────────────────────────────────────────────────────────

const MESSAGES: Record<string, string[]> = {
  idle:  ['Waiting...', "What's next?", 'Ready!', 'Standing by.', 'Hello!', 'Bored...'],
  focus: ['In the zone.', 'Keep going!', 'Stay sharp.', "Don't stop!", 'Flow state.', 'Focus!'],
  break: ['Take a breath.', 'Stretch!', 'Hydrate!', 'Rest up.', 'Recharging...', 'Zzz...'],
  happy: ['Great job!', 'You rock!', 'Awesome!', 'Nailed it!', 'Woohoo!', 'Level up!'],
  sad:   ["Don't give up.", 'You got this.', 'Keep trying!', 'Almost there!'],
};

// ─── Colors per mood ─────────────────────────────────────────────────────────

const MOOD_COLOR: Record<string, string> = {
  idle:  '#71717a', // zinc-500
  blink: '#71717a',
  focus: '#818cf8', // indigo-400
  break: '#34d399', // emerald-400
  happy: '#f472b6', // pink-400
  sad:   '#60a5fa', // blue-400
};

type Mood = keyof typeof SPRITES;

// ─── Component ───────────────────────────────────────────────────────────────

export const RetroPet = () => {
  const { mode, isRunning } = useSelector((state: RootState) => state.pomodoro);
  const completedCount = useSelector(
    (state: RootState) => state.tasks.items.filter(t => t.completed).length,
  );

  const [mood, setMood] = useState<Mood>('idle');
  const [message, setMessage] = useState('Hello!');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Stable base mood (driven by timer state), separate from click overrides
  const baseMoodRef = useRef<Mood>('idle');
  const overrideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCompletedRef = useRef(completedCount);

  // Pick a random message for a given mood
  const pickMessage = (m: Mood) => {
    const list = MESSAGES[m] ?? MESSAGES.idle;
    return list[Math.floor(Math.random() * list.length)];
  };

  // Apply a temporary mood override then revert to base
  const applyOverride = (m: Mood, durationMs: number) => {
    if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);
    setMood(m);
    setMessage(pickMessage(m));
    overrideTimerRef.current = setTimeout(() => {
      setMood(baseMoodRef.current);
      setMessage(pickMessage(baseMoodRef.current));
      overrideTimerRef.current = null;
    }, durationMs);
  };

  // ── Derive base mood from timer state ─────────────────────────────────────
  useEffect(() => {
    let next: Mood = 'idle';
    if (isRunning) {
      next = mode === 'focus' ? 'focus' : 'break';
    }
    baseMoodRef.current = next;

    // Only update displayed mood if no override is active
    if (!overrideTimerRef.current) {
      setMood(next);
      setMessage(pickMessage(next));
    }
  }, [isRunning, mode]);

  // ── React to task completion ───────────────────────────────────────────────
  useEffect(() => {
    if (completedCount > prevCompletedRef.current) {
      applyOverride('happy', 3000);
      // Burst of hearts from the centre of the pet
      setHearts(
        Array.from({ length: 5 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 40 - 20,
          y: Math.random() * 20 - 10,
        })),
      );
      setTimeout(() => setHearts([]), 1200);
    }
    prevCompletedRef.current = completedCount;
  }, [completedCount]);

  // ── Occasional blink while idle ────────────────────────────────────────────
  useEffect(() => {
    if (mood !== 'idle') return;
    const schedule = () => {
      const delay = 3000 + Math.random() * 4000;
      return setTimeout(() => {
        setMood('blink');
        setTimeout(() => {
          setMood('idle');
          schedule();
        }, 150);
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, [mood]);

  // ── Rotate idle messages ───────────────────────────────────────────────────
  useEffect(() => {
    if (overrideTimerRef.current) return;
    const t = setInterval(() => {
      if (!overrideTimerRef.current) {
        setMessage(pickMessage(baseMoodRef.current));
      }
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // ── Pet click handler ──────────────────────────────────────────────────────
  const lastClickRef = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    // Ignore the second click of a double-click (< 300 ms since last click)
    const now = Date.now();
    if (now - lastClickRef.current < 300) return;
    lastClickRef.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const heart = {
      id: now,
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
    setHearts(prev => [...prev, heart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== heart.id)), 900);
    applyOverride('happy', 900);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const sprite = SPRITES[mood] ?? SPRITES.idle;
  const color  = MOOD_COLOR[mood] ?? MOOD_COLOR.idle;

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-50 flex flex-col items-center select-none cursor-grab active:cursor-grabbing"
    >
      {/* Speech bubble */}
      <div className="mb-2 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 shadow-lg">
        <p className="font-mono text-[10px] text-zinc-300 whitespace-nowrap">{message}</p>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 overflow-hidden">
          <div className="w-2 h-2 bg-zinc-700 rotate-45 mx-auto -mt-1" />
        </div>
      </div>

      {/* Pixel pet */}
      <div
        className="relative cursor-pointer"
        onClick={handleClick}
        onDoubleClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-8 gap-px p-1.5 bg-zinc-900 rounded border border-zinc-800 shadow-lg">
          {sprite.flat().map((on, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-[1px]"
              style={on ? { backgroundColor: color } : undefined}
            />
          ))}
        </div>

        {/* Hearts */}
        <AnimatePresence>
          {hearts.map(h => (
            <motion.span
              key={h.id}
              initial={{ opacity: 1, scale: 0.6, x: h.x, y: h.y }}
              animate={{ opacity: 0, scale: 1.4, y: h.y - 36 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-400 text-xs pointer-events-none"
            >
              ♥
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-1.5 text-[8px] text-zinc-700 font-mono tracking-widest">v2.0</p>
    </motion.div>
  );
};

