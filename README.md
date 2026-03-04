# TRP Focus

A retro-styled Pomodoro productivity app with task management, built with React, Redux Toolkit, and Tailwind CSS. Features a monochromatic CRT aesthetic and a pixel-art companion pet that reacts to your session state.

---

## Features

### Pomodoro Timer
- Three modes: **Focus**, **Short Break**, and **Long Break**
- Live millisecond display for precise countdowns
- Configurable durations for all three modes
- Optional auto-start for breaks and subsequent focus sessions
- Wake Lock API integration — keeps your screen on during active focus sessions

### Task Management
- Add, complete, and delete tasks
- Nested **subtasks** with individual completion tracking
- Tasks persist across sessions via **local storage**
- Export your task list as a `.json` file
- Import a previously exported task list to restore your backlog

### Theming
- Separate color themes for **focus** and **break** modes
- Accent color changes dynamically as you switch between modes
- Settings panel with **Timer**, **Theme**, and **Data** tabs

### Retro Aesthetic
- Full-screen **CRT scanline overlay** for a vintage monitor effect
- **8×8 pixel-art companion pet** with mood-reactive sprites:
  - Idle when the timer is paused
  - Focused (visor sprite) during a focus session
  - Relaxed during breaks
  - Happy and excited on task completion

---

## Use Cases

| Who | How they use it |
|-----|----------------|
| Developers & writers | Structure deep work into focused 25-minute blocks with automatic break reminders |
| Students | Break study material into tasks and subtasks, ticking them off session by session |
| Remote workers | Keep sessions on track without browser distractions — wake lock prevents screen timeout in presentations or co-working calls |
| Task-heavy workflows | Import/export JSON task lists to archive completed sprints or carry tasks between devices |

---

## Tech Stack

| Layer | Library |
|-------|---------|
| UI | React 19, Tailwind CSS v4 |
| State | Redux Toolkit + React-Redux |
| Animation | Motion (Framer Motion v12) |
| Icons | Lucide React |
| Build | Vite 6 |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

```bash
# Type-check without emitting
npm run lint

# Production build
npm run build
```

---

## Project Structure

```
src/
├── components/       # UI components (Timer, TaskList, Header, etc.)
│   └── ui/           # Reusable primitives (Button, Input)
├── hooks/            # useQuotes, useTime, useWakeLock
├── store/            # Redux slices (pomodoro, tasks)
└── utils/            # Theme helpers
```

---

## Settings Reference

| Setting | Description |
|---------|-------------|
| Focus Duration | Length of a focus session (default 25 min) |
| Short Break | Length of a short break (default 5 min) |
| Long Break | Length of a long break (default 15 min) |
| Auto-start Breaks | Automatically start break timer when focus ends |
| Auto-start Pomodoros | Automatically start next focus session after a break |
| Focus Color | Tailwind accent color used during focus mode |
| Break Color | Tailwind accent color used during break mode |
| Export Tasks | Download all tasks as `focusflow_tasks.json` |
| Import Tasks | Restore tasks from a previously exported JSON file |
