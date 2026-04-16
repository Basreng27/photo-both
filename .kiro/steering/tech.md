# Tech Stack

## Stack
- **Language**: TypeScript
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Fonts**: Google Fonts (Pacifico, Nunito) via CDN
- **Styling**: Inline styles (no CSS framework)
- **Canvas API**: Used for photo capture and download generation

## Commands
```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview production build
npm run lint       # run ESLint
```

## Key APIs Used
- `navigator.mediaDevices.getUserMedia` — camera access
- `HTMLCanvasElement` / `CanvasRenderingContext2D` — photo capture & strip rendering
- `canvas.toDataURL('image/png')` — download generation

## Notes
- No external UI libraries; all styling is done with inline React styles
- `verbatimModuleSyntax` is enabled — always use `import type` for type-only imports
- Unused variables cause build errors (strict TypeScript config)
