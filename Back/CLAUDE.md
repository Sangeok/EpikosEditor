# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm install` - Install dependencies
- `npm run start:dev` - Start development server with watch mode
- `npm run start` - Start production server
- `npm run build` - Build the application
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Testing Commands
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## Architecture Overview

This is a **NestJS-based video editing backend** that integrates with **Remotion** for video rendering. The application provides REST APIs and WebSocket connections for real-time video processing with progress tracking and cancellation support.

### Key Technologies
- **NestJS** - TypeScript-first Node.js framework
- **Remotion** - React-based video rendering engine
- **Socket.IO** - Real-time WebSocket communication
- **TypeScript** - Configured with strict type checking

### Core Modules

#### Video Module (`src/video/`)
- **VideoService**: Handles video creation using Remotion bundling and rendering
- **VideoController**: REST API endpoints for video operations
- **VideoGateway**: WebSocket gateway for real-time progress updates and job cancellation
- **Types**: Comprehensive TypeScript interfaces for video elements (text, media, audio)

#### Remotion Integration (`src/remotion/`)
- **MyComposition**: Main Remotion composition with dynamic props
- **VideoEditor**: React component for rendering video elements
- **Bundle Location**: `src/remotion/index.js` (bundled during video creation)

### Application Architecture

1. **Request Flow**: Client → REST API → VideoService → Remotion bundling → Video rendering
2. **WebSocket Flow**: Client subscribes to job → Real-time progress updates → Completion/cancellation events
3. **File Management**: Videos output to `uploads/` directory with timestamp-based naming

### Key Features

- **Job Management**: Track and cancel long-running video rendering jobs
- **Real-time Progress**: WebSocket-based progress updates during rendering
- **CORS Configuration**: Supports development and production origins
- **File Upload**: 10MB request body limit for media uploads
- **Type Safety**: Comprehensive TypeScript interfaces for all video elements

### Configuration Notes

- **Port**: Runs on port 8080 (configurable via `PORT` environment variable)
- **Output Directory**: Videos rendered to `uploads/video-{timestamp}.mp4`
- **Remotion Bundle**: Dynamically bundled from `src/remotion/index.js`
- **CORS**: Configured for localhost development and production URLs
- **TypeScript**: Uses `nodenext` module resolution with React JSX support

### Development Workflow

1. Video creation requests trigger Remotion bundling process
2. Composition selection with input props validation
3. Media rendering with progress tracking via WebSocket
4. Output file generation in uploads directory
5. Job cleanup and client notification upon completion/cancellation