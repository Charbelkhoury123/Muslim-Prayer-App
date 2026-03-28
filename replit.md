# Aqimo - Muslim Prayer App

## Overview
Aqimo is a React Native (Expo) mobile application for Muslims to track prayer times, maintain a prayer journal, and manage app-blocking focus sessions during Salah.

## Architecture
- **Framework**: Expo (React Native) with classic `App.tsx` entry point (not Expo Router)
- **Language**: TypeScript
- **State Management**: Zustand with persist middleware
- **Storage**: expo-sqlite (SQLite for journal entries), in-memory fallback for other storage
- **Navigation**: Custom tab navigation (Home, Journal, Settings)
- **Localization**: i18next with English/Arabic support
- **Prayer Times**: adhan library

## Project Structure
```
App.tsx              # Root component with tab navigation
index.tsx            # Entry point (registerRootComponent)
src/
  components/        # Shared components (Onboarding, QiblaCompass, StreakCard, etc.)
  config/            # Brand configuration
  hooks/             # Custom hooks (prayer times, location, preferences, etc.)
  i18n/              # Internationalization (en/ar locales)
  screens/           # App screens (Home, Settings, Journal, Onboarding, About, etc.)
  services/          # Service layer
  storage/           # Storage adapters (SQLite db, in-memory mmkv polyfill)
  store/             # Zustand store (useAppStore)
  theme.ts           # Color/styling constants
  types/             # TypeScript types
  utils/             # Utility functions
assets/              # App icons and images
```

## Key Dependencies
- `expo` ~54.0.0
- `expo-location` - For GPS-based prayer time calculation
- `expo-sqlite` - Journal entry persistence
- `expo-notifications` - Prayer time reminders
- `expo-sensors` - Qibla compass
- `adhan` - Prayer time calculation
- `i18next` / `react-i18next` - Localization
- `zustand` - State management
- `lottie-react-native` - Animations
- `react-native-reanimated` - Animations
- `react-dom` / `react-native-web` - Web support

## Running the App
- **Workflow**: "Start application" runs `npx expo start --web --port 5000`
- **Port**: 5000
- **Web**: Accessible at port 5000 in the browser preview
- **Mobile**: Scan the QR code from the Expo dev server to test on physical device via Expo Go

## Important Notes
- `metro.config.js` is configured to disable package exports resolution (`unstable_enablePackageExports: false`) to avoid `import.meta` errors from zustand's ESM builds on web
- The app uses a memory-based storage fallback (not MMKV) for Expo Go compatibility
- expo-sqlite doesn't fully support web; initDB is called on startup but may be a no-op on web
- Zustand store uses an in-memory storage adapter (settings don't persist on reload in dev)

## Deployment
- Target: autoscale
- Build: `npx expo export --platform web`
- Run: `npx expo start --web --port 5000 --no-dev`
