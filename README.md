# JSONForge

**Professional JSON Toolkit** - Modern, fast, and powerful JSON editor with validation, formatting, and visualization tools.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Build for Production](#-build-for-production)
- [Usage Guide](#-usage-guide)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Editor Options](#-editor-options)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

##  Features

| Category | Features |
|----------|----------|
| **Core** | JSON Validator, JSON Formatter, Tree View, Raw View |
| **File** | Upload JSON, Download JSON, Copy to Clipboard, Drag & Drop |
| **Editor** | Dark/Light Mode, Line Numbers, Syntax Highlighting, Error Highlighting |
| **Format** | Pretty Print (2/4 spaces), Minify/Compress |

---

##  Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation


# Clone the repository
git clone https://github.com/yourusername/jsonforge.git
cd jsonforge

# Install dependencies
npm install

# Start development server
npm run dev

# Build the application
npm run build

# Preview the production build
npm run preview

---

## Usage Guide

**Validator Tab**
Enter or paste JSON in the input panel

Click "Validate" button

View validation results and error locations

**Formatter Tab**
Enter JSON in the input panel

Choose indentation size (2 or 4 spaces)

Click "Format" for pretty print or "Minify" for compact view

**Tree View**
Validate your JSON first

Click "Tree" button to visualize structure

Expand/collapse nodes to explore nested data

---

## Tech Stack

Technology	Purpose
React 18	UI Framework
TypeScript	Type Safety
Monaco Editor	Code Editor
Vite	Build Tool
Tailwind CSS	Styling

---

## Project Structure


## 📁 Project Structure
jsonforge/
├── public/
│ └── favicon.svg
├── src/
│ ├── components/
│ │ └── TreeView.tsx
│ ├── hooks/
│ │ └── useLocalStorage.ts
│ ├── App.tsx
│ ├── main.tsx
│ ├── index.css
│ └── vite-env.d.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .gitignore
└── README.md
---

## Configuration

Editor Options
Option	Values
Indentation	2 spaces, 4 spaces
Theme	Dark Mode, Light Mode
Font	Fira Code, JetBrains Mono

---

## Troubleshooting

Common Issues and Solutions
Issue	Solution
Port already in use	Run npm run dev -- --port 3001
Node modules issues	Run rm -rf node_modules package-lock.json && npm install
Tailwind styles not working	Run npm run dev then hard refresh (Ctrl + Shift + R)

---

## Still Having Issues?

Clear your browser cache

Delete node_modules and reinstall

Check Node.js version (v18+ required)

Open an issue on GitHub

---

## License
This project is licensed under the MIT License - feel free to use it for personal or commercial purposes.

**MIT License**

Copyright (c) 2026 JSONForge

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...

---

## Contributing
Contributions, issues, and feature requests are welcome!

Fork the project

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

---
## Acknowledgments

Monaco Editor - Powerful code editor

Tailwind CSS - Utility-first CSS framework

Vite - Next generation frontend tooling

React - UI library

---

<div align="center">

Made with ❤️ for developers who need professional JSON tools

Report Bug · Request Feature

</div> 
