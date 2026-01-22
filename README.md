# Sync Doc Editor

A modern, lightweight documentation editor built with **Next.js + TailwindCSS + Markdown**.

It allows users to create structured documents with sections, nested pages, markdown blocks, and code blocks, similar to Notion or internal documentation tools.

Designed for fast writing, clean UI, and developer-friendly editing with keyboard shortcuts.

### Demo Video link https://drive.google.com/drive/folders/1I2vWHKYmOGCXv0ZGq8yCB_QkQWMYQfTC?usp=sharing

## 🚀 Project Overview

Sync Doc Editor is a mini documentation platform where users can:

- Create sections and nested documents
- Write Markdown content
- Add multiple code blocks with language labels
- Live preview rendered markdown
- Use rich formatting (bold, italic, underline, headings, links)
- Undo/Redo changes
- Use keyboard shortcuts
- Auto-save locally (localStorage persistence)
- Clean VSCode-like UI with toolbar + sidebar tree

### ✨ Key Features

### Editor
- Markdown textarea editor
- Auto-resizing input
- Formatting toolbar
- Keyboard shortcuts
- Paragraph + H1/H2/H3 support

### Code Blocks
- Multi-language tabs
- Monaco-style dark theme
- Line numbers
- Copy button
- Syntax-friendly layout

### Sidebar
- Tree structure (nested docs)
- Collapsible hierarchy
- Search documents
- Double-click rename
- Add/Delete docs & sections

### Productivity
- Undo / Redo (Ctrl+Z / Ctrl+Shift+Z)
- Save button (UI ready)
- Local auto-save
- Clean minimal UI

---

## 🛠 Tech Stack

- Next.js (App Router)
- React 19
- TypeScript
- TailwindCSS
- React Markdown
- Lucide Icons

---

## 📦 Setup Instructions

Clone the repository:

```bash
git clone https://github.com/aryashantanu405/sync-doc-editor
cd sync-doc-editor
pnpm install
pnpm run dev
