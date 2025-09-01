import React from 'react';
import { Button } from 'react-native';
import { useNotificationStore } from '@/store/useNotificationStore';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {client} from "@/client";


const AddNotificationButton = () => {
    const addNotification = useNotificationStore((state) => state.addNotification);

    // دالة لإرسال الإشعار إلى Sanity
    const addNotificationToSanity = async (notification : any) => {
        try {
            // أنشئ مستند جديد في Sanity مع الحقول المناسبة
            await client.create({
                _type: 'notification',
                _id: notification.id, // استخدم الـ id نفسه لو تحب
                title: notification.title,
                message: notification.message,
                time: new Date().toISOString(), // أو استخدم notification.time حسب التنسيق
                read: false,
                type: notification.type || 'other', // إذا تستخدم نوع
            });
        } catch (error) {
            console.error('Failed to add notification to Sanity:', error);
        }
    };

    const handleAddNotification = async () => {
        const newNotification = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'admin',
            message: 'Hi there, I want to add a new notification. The update will be executed soon.',
            time: new Date().toISOString(),
            type: 'admin', // مثال لقيمة النوع، حسب سكيمتك
        };

        // أضف في Zustand
        addNotification(newNotification);

        // أرسل إلى Sanity
        await addNotificationToSanity(newNotification);

        // عرض إشعار محلي
        if (Device.isDevice) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission not granted for notifications');
                return;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: newNotification.title,
                    body: newNotification.message,
                    data: { local: true },
                },
                trigger: null,
            });
        } else {
            alert('Must use physical device for push notifications');
        }
    };

    return <Button title="Add Notification" onPress={handleAddNotification} />;
};

export default AddNotificationButton;