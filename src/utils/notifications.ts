import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { PrayerTimesResult } from '../hooks/usePrayerTimes';

// Configure notification behavior
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleAthanNotifications(prayerTimes: PrayerTimesResult) {
  // Clear existing scheduled notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    if (prayer.time > new Date()) {
       await Notifications.scheduleNotificationAsync({
        content: {
          title: `Athan: ${prayer.name}`,
          body: `It's time for ${prayer.name} prayer.`,
          sound: Platform.OS === 'ios' ? 'athan.wav' : 'default', // Custom sound needs to be in assets
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: prayer.time,
        } as Notifications.DateTriggerInput,
      });
    }
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
