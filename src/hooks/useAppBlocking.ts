import { useEffect } from 'react';
import { usePrayerFocus } from './usePrayerFocus';
import { useAppStore } from '../store/useAppStore';
import { AppBlockingService } from '../services/AppBlockingService';

/**
 * Hook to synchronize the UI focus state with the native app blocking service.
 */
export function useAppBlocking() {
  const activeFocus = usePrayerFocus();
  const { blockedAppIds } = useAppStore();

  useEffect(() => {
    if (activeFocus && blockedAppIds.length > 0) {
      console.log(`[useAppBlocking] Focus active for ${activeFocus.label}, starting block`);
      AppBlockingService.startBlocking(blockedAppIds);
    } else {
      console.log(`[useAppBlocking] No active focus, stopping block`);
      AppBlockingService.stopBlocking();
    }
  }, [activeFocus, blockedAppIds]);

  return activeFocus;
}
