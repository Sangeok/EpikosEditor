# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VideoEditorH is a web-based video editing platform built with Next.js 15, React 19, and TypeScript. The project uses Remotion for video rendering and follows Feature-Sliced Design architecture pattern.

## Development Commands

The main application is located in the `Front/` directory. Always `cd Front/` before running commands.

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

Development server runs at `http://localhost:3000`.

## Architecture

The project follows **Feature-Sliced Design** with these key layers:

### Entities (`src/entities/`)

- `Project/`: Project management (Zustand store, types)
- `media/`: Media elements management (text, video, audio, images)

### Features (`src/features/`)

- `Edit/`: Main editing functionality
  - `model/`: Business logic, hooks, stores, services
  - `ui/`: UI components organized by feature area

### Shared (`src/shared/`)

- `ui/atoms/`: Reusable UI components (Button, Input, Slider, etc.)

### Widgets (`src/widgets/`)

- High-level composed components (EditorHeader, EditorFooter, Hero)

## Key Technologies

- **State Management**: Zustand for all stores
- **Video Engine**: Remotion (@remotion/player, remotion)
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS 4 with dark theme
- **Icons**: Lucide React

## Core Architecture Components

### Timeline System

- `useTimelineStore`: Manages timeline state, zoom, playback
- Timeline components handle different media types (Text, Video, Image, Music)
- Zoom system: 1x (100%) to 10x (1000%) with pixel-perfect calculations

### Player System

- `Player.tsx`: Remotion player wrapper
- `PlayerService`: Time/frame conversion utilities
- Hooks: `usePlayerController`, `usePlayerSync` for timeline synchronization

### Media Management

- `useMediaStore`: Manages project media elements
- Type definitions for TextElement, VideoElement, etc.
- Support for text, video, audio, image elements

## File Structure Conventions

- Use absolute imports with `@/` prefix
- TypeScript interfaces in dedicated `types/` directories
- Zustand stores use `use[Name]Store.ts` naming
- Shared/ui components follow atomic design principles (atoms → molecules → organisms)
- `/shared/ui` MUST strictly follow atomic design pattern principles
- Feature-based organization over technical layers

### Component Structure (FSD Pattern)

Components that require both UI and types should follow this nested structure:

```
ComponentName/
├── ui/
│   └── ComponentName.tsx
└── model/
    └── types.ts
```

**Key Principles:**

- **Locality of Reference**: Component-specific types stay within the component's directory
- **FSD Separation**: UI components in `ui/`, types/logic in `model/`
- **Single Responsibility**: Each layer handles its specific concern
- **Example**: `DraggableText/ui/DraggableText.tsx` + `DraggableText/model/types.ts`

**DO NOT** place types in deeply nested paths like `_component/types/` - always use the component's own `model/` directory.

## Development Notes

- The app uses Turbopack for fast development builds
- All components are client-side ("use client" directive common)
- Dark theme is applied globally via Tailwind CSS
- State management is entirely client-side with Zustand
- Player synchronization happens through ref-based communication

## Important Development Reminders

- The working directory is the `front/` directory - all commands should be run from here
- The main route is located at `app/page.tsx` which contains the video editor interface
- No test framework is currently configured - if tests are needed, they must be set up first
- TypeScript configuration uses `@/` imports pointing to `src/` directory

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

## CRITICAL: File Editing on Windows

### ⚠️ MANDATORY: Always Use Backslashes on Windows for File Paths

**When using Edit or MultiEdit tools on Windows, you MUST use backslashes (`\`) in file paths, NOT forward slashes (`/`).**

#### ❌ WRONG - Will cause errors:

```
Edit(file_path: "D:/repos/project/file.tsx", ...)
MultiEdit(file_path: "D:/repos/project/file.tsx", ...)
```

#### ✅ CORRECT - Always works:

```
Edit(file_path: "D:\repos\project\file.tsx", ...)
MultiEdit(file_path: "D:\repos\project\file.tsx", ...)
```
