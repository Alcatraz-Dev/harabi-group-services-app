import { View, TouchableOpacity } from 'react-native';
import React, {useEffect} from 'react';
import { useRouter } from 'expo-router';
import { BellIcon } from 'react-native-heroicons/outline';
import {useNotificationStore} from "@/store/useNotificationStore";
import {useUser} from "@clerk/clerk-expo";



const NotificationButton = () => {
    const router = useRouter();
const { user } = useUser();
    const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
    const hasUnread = useNotificationStore((state) => state.hasUnread());
    useEffect(() => {
        let listener: any = null;
        const uid = user?.id;
        if (!uid) return;


        fetchNotifications(uid).then(() => {
           console.log('Notifications fetched');
        });

        return () => {
            if (listener) {
                listener.unsubscribe();
            }
        };
    }, [user?.id]);
    return (
        <TouchableOpacity
            onPress={() => router.push('/(notification)/notification')}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 relative"
        >
            {hasUnread && (
                <View className="w-2.5 h-2.5 rounded-full bg-[#FF9F00] absolute top-0 right-0" />
            )}

            <BellIcon size={24} color="#6b7280" />
        </TouchableOpacity>
    );
};

export default NotificationButton;