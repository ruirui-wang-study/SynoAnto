# SynoAnto - Design and Usage Document

## 1. Project Overview
**SynoAnto** is an interactive English learning application focuses on visualizing relationships between words (synonyms and antonyms) and analyzing their nuances. The application helps users understand the subtle differences between similar words through a visual "Word Galaxy" and detailed comparison views.

## 2. Technology Stack
- **Core Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Variables for theming
- **Linting**: ESLint

## 3. Directory Structure
The project follows a feature-based architecture:

```
src/
├── assets/          # Static assets
├── components/      # Shared reusable components
├── data/            # Static data files (if any)
├── features/        # Main feature modules
│   ├── NuanceAnalysis/ # Logic for word comparison & nuances
│   └── WordGalaxy/     # Logic for the interactive graph visualization
├── hooks/           # Custom React hooks
├── services/        # API services (e.g., wordService.ts)
├── styles/          # Global styles and variables
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component & routing logic
└── main.tsx         # Application entry point
```

## 4. Key Features & Design

### 4.1. Welcome Screen
- **Design**: Minimalist, clean interface focusing on the search bar.
- **Functionality**: Users enter a target word to begin their exploration.
- **State**: Manages loading states and handles errors if a word is not found.

### 4.2. Word Galaxy (Visualizer)
- **Concept**: A node-link diagram where the searched word is the "Center" (Sun) and related words (synonyms/antonyms) orbit around it.
- **Interactions**:
    - **Pan & Zoom**: Users can drag the canvas and zoom in/out with the mouse wheel.
    - **Selection**: Clicking a satellite node triggers the detail comparison view.
- **Visuals**:
    - **Center Node**: Larger, distinct color.
    - **Synonyms**: Connected with specific styled lines, distinct colors.
    - **Antonyms**: Connected with contrasting lines/colors.

### 4.3. Nuance Analysis (Deep Dive)
- **Purpose**: To explain *why* two synonyms are different.
- **Components**:
    - **Side-by-Side View**: Compares the original search word with the selected node.
    - **Details Card**: Shows definition, part of speech, pronunciation, and a primary example sentence.
    - **Usage Comparison**: A generated text summary explaining the contextual difference (e.g., "formal vs. casual").
    - **Comparison Table**: Visualizes attributes like **Intensity**, **Formality**, and **Context** using progress bars and badges.

## 5. Design System

### Color Palette (from `variables.css`)
- **Primary**: Indigo/Blue (`#667eea`) - Used for primary actions and center elements.
- **Secondary**: Pink (`#f687b3`) - Used for accents.
- **Success**: Green (`#48bb78`) - Often associated with synonyms or positive validation.
- **Danger**: Red (`#f56565`) - Often associated with antonyms or error states.
- **Backgrounds**: Clean whites and soft grays (`#f7fafc`) to maintain a modern, airy feel.

### Typography
- The app uses system fonts prioritized for legibility, with a focus on clean hierarchy (H1 for logos, H2 for word titles, etc.).

## 6. Usage Guide

### prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
```bash
npm install
```

### Development
To start the local development server:
```bash
npm run dev
```
The app will typically run at `http://localhost:5173`.

### Building for Production
To create a production-ready build:
```bash
npm run build
```
The artifacts will be generated in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 7. Future Roadmap (Suggestions)
- **Backend Integration**: Currently mocks or uses a simple service. Future versions could integrate with a real Thesaurus API.
- **User Accounts**: Save favorite words or history.
- **Gamification**: "Word Chain" challenges connecting distant words.
