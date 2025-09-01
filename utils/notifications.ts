import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {Platform} from "react-native";
import {useUser} from "@clerk/clerk-expo";


export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        alert('يجب استخدام جهاز حقيقي لتلقي الإشعارات');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('لم يتم منح إذن الإشعارات!');
        return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', tokenData.data);
    return tokenData.data;
}

export async function savePushTokenToServer(token: string, userId: string) {
    try {
        await fetch('https://expo-notification-webhook.vercel.app/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                platform: Platform.OS,
                userId,
            }),
        });
    } catch (error) {
        console.error('Failed to save push token:', error);
    }
}