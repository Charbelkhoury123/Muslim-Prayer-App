# Audio Assets for Aqimo

To enable the Athan notification sound, place an audio file named `athan.wav` in this directory (`src/assets/sounds/`).

## Requirements:
- **Filename**: `athan.wav`
- **Format**: `.wav` is recommended for maximum compatibility with `expo-notifications` on iOS.
- **Duration**: Most systems limit notification sounds to 30 seconds.

## Implementation:
The notification utility in `src/utils/notifications.ts` is already configured to look for this file:

```typescript
sound: Platform.OS === 'ios' ? 'athan.wav' : 'default'
```

*Note: For Android, the custom sound must be added to the native resource directory (res/raw) which requires a native build/prebuild.*
