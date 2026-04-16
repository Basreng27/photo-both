# Project Structure

```
photobooth-app/
├── src/
│   ├── components/
│   │   ├── LayoutSelector.tsx        # Grid layout picker with SVG diagrams
│   │   ├── LayoutSelector.module.css
│   │   ├── Camera.tsx                # Webcam feed + countdown overlay + capture logic
│   │   ├── Camera.module.css
│   │   ├── FrameSelector.tsx         # Frame picker UI
│   │   ├── BackgroundSelector.tsx    # Background picker UI
│   │   ├── SelectorGroup.module.css  # Shared styles for selectors
│   │   ├── PhotoStrip.tsx            # Final strip display + download/retake buttons
│   │   └── PhotoStrip.module.css
│   ├── data/
│   │   ├── frames.ts                 # Frame definitions (colors, styles, decorations)
│   │   ├── backgrounds.ts            # Background definitions (CSS gradients)
│   │   └── layouts.ts                # Grid layout definitions (photoCount, aspectRatio)
│   ├── hooks/
│   │   ├── useCountdown.ts           # Countdown timer + capture trigger signal
│   │   └── useCamera.ts              # Webcam access, mirror state, frame capture
│   ├── utils/
│   │   └── canvasDownload.ts         # Canvas rendering + PNG download logic
│   ├── constants.ts                  # All magic numbers and config values
│   ├── types.ts                      # Shared TypeScript types (AppState, Frame, Background)
│   ├── App.tsx                       # Root + sub-views (SetupView, ShootingView, ResultView)
│   ├── App.module.css
│   ├── App.css                       # Minimal global overrides
│   ├── index.css                     # Body/root reset + Google Fonts import
│   └── main.tsx                      # React entry point
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.app.json
```

## Architecture Patterns
- **State machine** in `App.tsx`: three states — `setup`, `shooting`, `result`
- **Sub-views as named components**: `SetupView`, `ShootingView`, `ResultView` — each is a focused, single-responsibility component defined in `App.tsx`
- **Custom hooks** in `src/hooks/`: `useCountdown` (countdown timer + capture signal), `useCamera` (webcam access, mirror, frame capture)
- **Utility functions** in `src/utils/`: `canvasDownload.ts` handles all canvas rendering and PNG download logic
- **Data-driven UI**: frames and backgrounds are defined as data arrays in `src/data/`, not hardcoded in components
- **CSS Modules**: all styles live in `*.module.css` files co-located with their component; no inline style objects except for dynamic values (colors from frame data)
- **Ref-based photo accumulation**: `capturedPhotosRef` holds photos during shooting to avoid stale closure issues
- **Constants file**: all magic numbers live in `src/constants.ts`

## Naming Conventions
- Components: PascalCase `.tsx`
- CSS Modules: `ComponentName.module.css` co-located with component
- Hooks: camelCase prefixed with `use`, in `src/hooks/`
- Utilities: camelCase in `src/utils/`
- Data files: camelCase `.ts` in `src/data/`
- Types: PascalCase in `src/types.ts`
- Constants: SCREAMING_SNAKE_CASE in `src/constants.ts`

## Clean Code Rules
- No inline style objects for static values — use CSS modules
- Dynamic style values (frame colors, gradients) passed via `style` prop only
- Each function/component has a single responsibility
- Magic numbers must be defined in `constants.ts`
- Custom hooks encapsulate all side effects (camera, timers)
- Utility functions are pure and side-effect-free where possible
