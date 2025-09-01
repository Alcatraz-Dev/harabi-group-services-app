import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { client } from '@/client';

const LAST_NOTIFICATION_KEY = 'last_notification_id';

export default function useSanityNotifications() {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const query = `*[_type == "notification"] | order(time desc)[0] {
          _id,
          title,
          message,
          time
        }`;

                const latest = await client.fetch(query);
                if (!latest) return;

                const lastId = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);

                if (latest._id !== lastId) {
                    console.log('🔔 New notification from Sanity:', latest);

                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: latest.title,
                            body: latest.message,
                            sound: 'default',
                        },
                        trigger: null,
                    });

                    // 📝 حفظ المعرف في AsyncStorage
                    await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, latest._id);
                }
            } catch (error) {
                console.error('❌ Failed to fetch notifications:', error);
            }
        }, 60000); // كل دقيقة

        return () => clearInterval(interval);
    }, []);
}