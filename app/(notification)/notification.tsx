import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

import {
    Bell,
    Newspaper,
    Megaphone,
    CalendarClock,
    Info,
    Mail,
    AlertTriangle,
    Gift,
    Star,
    MessageSquareText,
    Wrench,
    BadgeCheck,
    ShieldAlert,
    ArrowLeftCircle,
    CheckCheck,
} from 'lucide-react-native';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUser } from '@clerk/clerk-expo';
import {formatTime} from "@/utils/formatNotificationTime";


const getIconByType = (type: string, read: boolean | undefined) => {
    const iconColor = read ? '#60a5fa' : '#f59e0b';

    switch (type.toLowerCase()) {
        case 'news':
            return <Newspaper size={24} color={iconColor} />;
        case 'announcement':
        case 'annonce':
            return <Megaphone size={24} color={iconColor} />;
        case 'reminder':
        case 'appointment':
            return <CalendarClock size={24} color={iconColor} />;
        case 'promotion':
        case 'offer':
            return <Gift size={24} color={iconColor} />;
        case 'warning':
        case 'danger':
        case 'alert':
            return <AlertTriangle size={24} color={iconColor} />;
        case 'message':
        case 'chat':
        case 'reply':
            return <MessageSquareText size={24} color={iconColor} />;
        case 'update':
        case 'system':
            return <Wrench size={24} color={iconColor} />;
        case 'verified':
        case 'success':
            return <BadgeCheck size={24} color={iconColor} />;
        case 'security':
        case 'login':
            return <ShieldAlert size={24} color={iconColor} />;
        case 'email':
        case 'mail':
            return <Mail size={24} color={iconColor} />;
        case 'review':
        case 'rate':
        case 'feedback':
            return <Star size={24} color={iconColor} />;
        case 'admin':
        case 'moderator':
            return <Bell size={24} color={iconColor} />;
        default:
            return <Info size={24} color={iconColor} />;
    }
};

type NotificationType = {
    id: string;
    title: string;
    message: string;
    time: string;
    read?: boolean;
    type?: string;
    usersRead: {
        userId: string;
        read: boolean;
        readAt: string;
    }[];
};

const NotificationItem = ({
                              id,
                              title,
                              message,
                              time,
                              read,
                              type,
                              onPress,
                          }: NotificationType & { onPress: (id: string) => void }) => {


    return (
        <TouchableOpacity
            className="flex-row items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800"
            onPress={() => onPress(id)}
        >
            <View className="mt-1">{getIconByType(type || 'info', read)}</View>
            <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">{title}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">{message}</Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {time}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const Notification = () => {
    const { theme: colorScheme } = useAppTheme();
    const router = useRouter();
    const { user } = useUser();

    const notifications = useNotificationStore((state) => state.notifications);
    const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let listener: any = null;
        const uid = user?.id;
        if (!uid) return;

        setLoading(true);
        fetchNotifications(uid).then(() => {
            setLoading(false);
        });

        return () => {
            if (listener) {
                listener.unsubscribe();
            }
        };
    }, [user?.id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#60a5fa" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-red-500 dark:text-red-400 text-center">{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="relative flex-row items-center justify-center px-5 py-4 mb-10">
                <TouchableOpacity onPress={() => router.back()} className="absolute left-5 p-1">
                    <ArrowLeftCircle size={25} color={colorScheme === 'dark' ? 'white' : '#4b5563'} />
                </TouchableOpacity>

                <Text className="text-2xl font-extrabold text-gray-800 dark:text-white text-center">Notifications</Text>

                {notifications.some((n) => !n.read) && user?.id && (
                    <TouchableOpacity
                        onPress={() => markAllAsRead(user.id)}
                        className="absolute right-5 flex-row items-center gap-1"
                    >
                        <Text className="text-xs font-semibold text-gray-800 dark:text-white">All read</Text>
                        <CheckCheck size={12} color={colorScheme === 'dark' ? 'white' : '#4b5563'} />
                    </TouchableOpacity>
                )}
            </View>

            {notifications.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 dark:text-gray-400 text-lg">No notifications found.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    extraData={notifications.map((n) => n.read).join(',')}
                    renderItem={({ item }) => (
                        <NotificationItem
                            {...item}
                            onPress={() => user?.id && markAsRead(item.id, user.id)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            )}
        </SafeAreaView>
    );
};

export default Notification;