# SamThing Client

A minimal React boilerplate/template for building device clients that communicate with a DeskThing server.

## What is this?

This is a **stripped-down, bare-bones template** for creating client applications that run on phone-like devices (like the Car Thing). It includes only the essential infrastructure needed to:

- **Connect to a DeskThing server via WebSocket**
- **Handle button/keyboard inputs** (including long-press detection)
- **Render React components** with routing
- **Sync time with the server**
- **Handle errors gracefully**

## What's Included (Core Features)

- ✅ **WebSocket connection management** - Automatic reconnection, heartbeat, message handling
- ✅ **Button/keyboard listener** - Short press, long press, wheel/scroll events
- ✅ **Time synchronization** - Server time sync with timezone support
- ✅ **React Router** - Client-side routing
- ✅ **Error boundary** - Graceful error handling
- ✅ **Settings persistence** - LocalStorage-based settings with Zustand
- ✅ **Manifest system** - Client identification for the server
- ✅ **Build system** - Compatible with @deskthing/cli for hardware deployment

## What's NOT Included (Removed Bloat)

- ❌ No app launcher/loader functionality
- ❌ No music controls or music store
- ❌ No action mapping system
- ❌ No clock, settings, or dashboard pages
- ❌ No UI component library
- ❌ No screensaver (can add back if needed)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (hardware-compatible)
npm run build
```

## Project Structure

```
src/
├── App.tsx                 # Main app component
├── main.tsx               # Entry point
├── components/
│   ├── ButtonListener.tsx # Keyboard/button event handler
│   └── TimeUpdater.tsx    # Time sync component
├── pages/
│   ├── Home.tsx           # Example home page (replace with your UI)
│   └── error/             # Error boundary
├── stores/
│   ├── websocketStore.ts  # WebSocket connection management
│   ├── settingsStore.ts   # Client settings & manifest
│   ├── timeStore.ts       # Time synchronization
│   └── uiStore.ts         # Button handlers & UI state
└── utils/
    ├── websocketManager.ts      # WebSocket connection logic
    ├── serverWebsocketHandler.ts # Server message handlers
    └── Logger.ts                 # Logging utility
```

## Customization

### Add Your Own Pages

Edit `src/pages/Home.tsx` or create new pages in `src/pages/`, then update the router in `src/components/nav/Router.tsx`.

### Handle Custom Server Messages

Add handlers in `src/utils/serverWebsocketHandler.ts` for any custom message types your server sends.

### Register Custom Button Handlers

```typescript
import { useUIStore } from '@src/stores/uiStore'
import { EventMode } from '@deskthing/types'

// In your component:
useEffect(() => {
  const unregister = useUIStore.getState().registerKeyHandler('my-page', (code, eventMode) => {
    if (eventMode === EventMode.PressShort && code === 'KeyA') {
      console.log('A key pressed!')
      return true // Consumed the event
    }
    return false // Let other handlers process it
  })

  return unregister // Cleanup on unmount
}, [])
```

## Version

Current version: **0.0.1**

This is a template/boilerplate - version your own project independently.

## License

See LICENSE file.
