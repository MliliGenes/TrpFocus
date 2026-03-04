export type ThemeColor = 'slate' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';

export const themeColors: ThemeColor[] = [
  'slate', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

export const getTheme = (color: string) => {
  // Default fallback
  const c = themeColors.includes(color as ThemeColor) ? color : 'emerald';
  
  return {
    // TUI Style: Dark backgrounds, bright text, visible borders
    bg: 'bg-zinc-950',
    bgDark: 'bg-black',
    
    // Primary elements (active states, buttons)
    primary: `bg-${c}-600 text-black border border-${c}-500`,
    primaryHover: `hover:bg-${c}-500`,
    
    // Secondary elements (inactive tabs, backgrounds)
    secondary: `bg-zinc-900 text-${c}-400 border border-${c}-800`,
    secondaryHover: `hover:bg-zinc-800 hover:border-${c}-600`,
    
    // Text colors
    text: `text-${c}-400`,      // Main terminal text color
    textLight: `text-${c}-300`, // Brighter/Active
    textDim: `text-zinc-500`,   // Muted/Inactive
    
    // Borders
    border: `border-${c}-800`,
    borderActive: `border-${c}-500`,
    
    // UI Elements
    ring: `focus:ring-${c}-500`,
    icon: `text-${c}-500`,
    
    // Selection/Highlight
    selection: `selection:bg-${c}-900 selection:text-${c}-200`,
  };
};
