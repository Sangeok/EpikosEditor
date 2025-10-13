# GEMINI Project Analysis: VideoEditorH

## Project Overview

This project, named "VideoEditorH," is a web-based video editing platform. It's built with a modern tech stack, featuring a Next.js 15 frontend with React 19 and TypeScript. The user interface is styled with Tailwind CSS 4 and utilizes Radix UI for components and Lucide React for icons. State management is handled by Zustand. The project architecture follows the Feature-Sliced Design pattern, which is a methodology for structuring web applications.

The application allows for multimedia editing, including text, video, images, music, and captions. It features a real-time preview of edits, project management capabilities, and the ability to export and share completed videos.

## Building and Running

The project uses `npm` as its package manager. The following commands are used for building and running the application:

- **Install dependencies:**
  ```bash
  npm install
  ```
- **Run development server:**
  ```bash
  npm run dev
  ```
  This command starts the development server with Turbopack at `http://localhost:3000`.
- **Build for production:**
  ```bash
  npm run build
  ```
- **Run production server:**
  ```bash
  npm start
  ```
- **Linting:**
  ```bash
  npm run lint
  ```

## Development Conventions

### Architecture: Feature-Sliced Design (FSD)

The project strictly adheres to the **Feature-Sliced Design (FSD)** pattern. This architectural style enhances maintainability and scalability by organizing code into distinct layers and slices. The `src` directory structure clearly reflects this pattern:

- **`pages`**: Composes widgets and features to create complete pages for specific routes.
- **`widgets`**: Assembles features and entities into large, independent UI blocks (e.g., the main editor interface, the hero section).
- **`features`**: Encapsulates user interaction logic and workflows (e.g., creating a new project, editing a media item).
- **`entities`**: Contains core business entities and their related logic (e.g., `Project`, `Media`).
- **`shared`**: Holds reusable code and UI components that are used across the entire application (e.g., utility functions, UI primitives).

This layered approach promotes low coupling and high cohesion, making the codebase easier to understand, test, and scale.

### Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, with `class-variance-authority`, `clsx`, and `tailwind-merge` for robust and maintainable component styling.
- **UI Components**: Radix UI for accessible, unstyled primitives, and Lucide React for icons.
- **State Management**: Zustand is used for global state management. Its simplicity and minimal boilerplate make it an excellent fit for the FSD architecture, allowing state to be managed at the feature or widget level where it is needed.
- **Video Engine**: `remotion` and `@remotion/player` are at the core of the video editing functionality, enabling programmatic video creation and manipulation within a React environment.
- **Subtitles**: `srt-parser-2` is used for parsing and handling SRT subtitle files.
- **Animation**: `tw-animate-css` provides Tailwind CSS-based animations.

### Code Quality and Standards

The project enforces a high standard of code quality through its ESLint configuration (`eslint.config.mjs`). By extending `next/core-web-vitals` and `next/typescript`, the project prioritizes:

- **Core Web Vitals**: A strong focus on web performance to ensure a smooth user experience.
- **TypeScript Best Practices**: Adherence to best practices for writing clean, type-safe code.
- **Next.js Conventions**: Following the recommended guidelines for building robust and optimized Next.js applications.

### Timeline Functionality

A detailed document (`Front/public/timeline-zoom-ruler.md`) outlines the implementation of the timeline's zoom and ruler functionality. This indicates a focus on creating a sophisticated and user-friendly editing interface. The timeline features dynamic zoom control, a smart ruler system, and visual feedback for the user.

# Guideline

When answering a question, the explanation should be in Korean.
