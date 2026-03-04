import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { motion, AnimatePresence } from 'motion/react';

const PIXEL_SIZE = 6; // Size of each "pixel" in rem/px multiplier

// 8x8 Pixel Art Sprites
const SPRITES = {
  idle: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  focus: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0], // Goggles/Visor
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  break: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,0,0,1,1,0], // Closed eyes
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0], // Small mouth
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  happy: [
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0], // ^ ^ eyes
    [0,1,0,1,1,0,1,0],
    [0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0], // Smile
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  excited: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,0,0,1,1,0], // Wide eyes
    [0,1,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0], // Big smile
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  thinking: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,0,0], // Hmm mouth
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  surprised: [
    [0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0], // Small eyes
    [0,1,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0], // O mouth
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
};

const MESSAGES = {
  idle: [
    "I'm ready!", "Let's work!", "System online.", "Awaiting input.", 
    "Ready to roll!", "Let's be productive!", "What's next?", "Standing by.",
    "Hello friend!", "I'm bored...", "Let's do this.", "Waiting for you."
  ],
  focus: [
    "Focusing...", "Crunching data...", "Do not disturb.", "In the zone.",
    "You got this!", "Stay sharp.", "Keep going!", "Almost there!",
    "Laser focus.", "Processing...", "Don't stop now!", "Flow state.",
    "You're doing great!", "Keep pushing!", "Stay with it!", "Eyes on the prize."
  ],
  break: [
    "Recharging...", "Zzz...", "Coffee time?", "Cooling down.",
    "Take a breath.", "Relax...", "Unwinding...", "System pause.",
    "Stretch a bit!", "Hydrate!", "Good break.", "Resting circuits."
  ],
  happy: [
    "Great job!", "Task complete!", "You rock!", "Level up!",
    "Awesome!", "Way to go!", "Victory!", "Success!",
    "Nailed it!", "Woohoo!", "Fantastic!", "Brilliant!",
    "So proud!", "You did it!", "Amazing work!", "High five!"
  ],
  excited: [
    "So much energy!", "Let's do this!", "I'm pumped!", "Let's gooo!",
    "Hyper speed!", "Maximum power!", "Can't stop us!", "Electric!"
  ],
  thinking: [
    "Hmm...", "Calculating...", "Analyzing...", "Processing...",
    "Thinking...", "One moment...", "Computing...", "Wait..."
  ],
  cool: [
    "Stay cool.", "No sweat.", "Easy peasy.", "Smooth.",
    "Chill vibes.", "Under control.", "Looking good.", "Style points."
  ],
  surprised: [
    "Whoa!", "Oh my!", "Wow!", "Incredible!",
    "Did you see that?", "Unbelievable!", "No way!", "Gasp!"
  ]
};

export const RetroPet = () => {
  const { mode, isRunning } = useSelector((state: RootState) => state.pomodoro);
  const completedTasks = useSelector((state: RootState) => 
    state.tasks.items.filter(t => t.completed).length
  );
  
  const [mood, setMood] = useState<'idle' | 'focus' | 'break' | 'happy' | 'excited' | 'thinking' | 'cool' | 'surprised'>('idle');
  const [message, setMessage] = useState("");
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [prevCompletedCount, setPrevCompletedCount] = useState(completedTasks);

  // Determine mood based on app state
  useEffect(() => {
    // If we just completed a task, stay happy for a bit
    if (mood === 'happy' || mood === 'excited' || mood === 'surprised') return;

    if (!isRunning) {
      // Only switch to idle moods if we are NOT in a break mode that is running
      // If we are paused in focus mode -> idle/thinking/cool
      // If we are paused in break mode -> idle/thinking/cool
      
      // Randomly switch between idle, thinking, cool, and surprised when not running
      const idleMoods: ('idle' | 'thinking' | 'cool' | 'surprised')[] = ['idle', 'idle', 'idle', 'thinking', 'cool', 'surprised'];
      // Only change mood occasionally to prevent flickering, or if the current mood is not appropriate for idle
      if (!['idle', 'thinking', 'cool', 'surprised'].includes(mood)) {
         setMood(idleMoods[Math.floor(Math.random() * idleMoods.length)]);
      }
    } else {
      // Timer IS running
      if (mode === 'shortBreak' || mode === 'longBreak') {
        setMood('break');
      } else {
        setMood('focus');
      }
    }
  }, [mode, isRunning, mood]);

  // Randomly change idle mood occasionally
  useEffect(() => {
    if (isRunning || mood === 'happy' || mood === 'excited' || mood === 'surprised') return;

    const interval = setInterval(() => {
       const idleMoods: ('idle' | 'thinking' | 'cool' | 'surprised')[] = ['idle', 'idle', 'idle', 'thinking', 'cool', 'surprised'];
       setMood(idleMoods[Math.floor(Math.random() * idleMoods.length)]);
    }, 8000); // Change idle mood every 8 seconds

    return () => clearInterval(interval);
  }, [isRunning, mood]);

  // React to task completion
  useEffect(() => {
    if (completedTasks > prevCompletedCount) {
      // Randomly choose between happy, excited, and surprised
      const moods: ('happy' | 'excited' | 'surprised')[] = ['happy', 'excited', 'surprised'];
      const successMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(successMood);
      setMessage(MESSAGES[successMood][Math.floor(Math.random() * MESSAGES[successMood].length)]);
      
      // Celebrate with hearts
      const newHearts = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() * 100 - 50),
        y: 50 + (Math.random() * 50 - 25),
      }));
      setHearts(prev => [...prev, ...newHearts]);
      
      // Reset mood after 3 seconds
      const timer = setTimeout(() => {
        setMood(prev => {
            if (!isRunning) return 'idle';
            if (mode === 'shortBreak' || mode === 'longBreak') return 'break';
            return 'focus';
        });
        setHearts([]);
      }, 3000);
      
      setPrevCompletedCount(completedTasks);
      return () => clearTimeout(timer);
    }
    setPrevCompletedCount(completedTasks);
  }, [completedTasks]);

  // Random messages
  useEffect(() => {
    if (mood === 'happy' || mood === 'excited' || mood === 'surprised') return; // Don't override happy/excited/surprised message

    const updateMessage = () => {
      const options = MESSAGES[mood];
      setMessage(options[Math.floor(Math.random() * options.length)]);
    };
    
    updateMessage();
    const interval = setInterval(updateMessage, 5000);
    return () => clearInterval(interval);
  }, [mood]);

  const handlePet = (e: React.MouseEvent) => {
    // Add a heart
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newHeart = { id: Date.now(), x, y };
    setHearts(prev => [...prev, newHeart]);
    
    // Temporarily happy
    const prevMood = mood;
    setMood('happy');
    setTimeout(() => setMood(prevMood), 1000);

    // Remove heart after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  const currentSprite = SPRITES[mood];

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-10 right-10 z-50 flex flex-col items-center cursor-grab active:cursor-grabbing"
    >
      {/* Speech Bubble */}
      <div className="mb-3 relative bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 shadow-lg">
        <p className="font-mono text-[10px] text-zinc-300 whitespace-nowrap">{message}</p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-zinc-700"></div>
      </div>

      {/* The Pet */}
      <div 
        className="relative group"
        onClick={handlePet}
      >
        <div className="grid grid-cols-8 gap-0.5 p-1.5 bg-zinc-900/90 rounded-lg border border-zinc-800 transition-transform group-hover:scale-105 active:scale-95 shadow-xl shadow-black/50 backdrop-blur-sm">
          {currentSprite.flat().map((pixel, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                backgroundColor: pixel ? (mood === 'break' ? '#60a5fa' : mood === 'focus' ? '#ef4444' : (mood === 'happy' || mood === 'excited' || mood === 'surprised') ? '#f472b6' : '#22c55e') : 'transparent',
                opacity: pixel ? 1 : 0.1,
                scale: pixel ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-[0.5px] ${pixel ? 'shadow-[0_0_4px_currentColor]' : ''}`}
            />
          ))}
        </div>

        {/* Hearts Container */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <AnimatePresence>
            {hearts.map(heart => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: heart.y, x: heart.x, scale: 0.5 }}
                animate={{ opacity: 0, y: heart.y - 50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                className="absolute text-pink-500 font-bold text-xs"
              >
                ♥
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <p className="mt-2 text-[8px] text-zinc-600 font-mono uppercase tracking-widest bg-zinc-950/50 px-1 rounded">v1.3</p>
    </motion.div>
  );
};
