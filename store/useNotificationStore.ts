import {create} from 'zustand';
import {formatDistanceToNow} from 'date-fns';
import {sv} from 'date-fns/locale';
import {client} from '@/client';

export type NotificationType = {
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
type NotificationStore = {
    notifications: NotificationType[];
    fetchNotifications: (userId: string) => Promise<void>;
    markAsRead: (id: string, userId: string) => Promise<void>;
    markAllAsRead: (userId: string) => Promise<void>;
    addNotification: (notification: Omit<NotificationType, 'read'>) => void;
    hasUnread: () => boolean;
    setNotifications: (notifications: NotificationType[]) => void;
    init: (userId: string) => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => {
    let listener: any = null;

    const fetchNotifications = async (userId: string) => {
        try {
            const rawNotifications = await client.fetch(`
            *[_type == "notification"] | order(time desc) {
                _id,
                title,
                message,
                time,
                type,
                usersRead
            }
        `);

            const normalized = rawNotifications.map((n: any) => {
                const readEntry = (n.usersRead ?? []).find(
                    (entry: any) => entry.userId === userId && entry.read === true
                );

                return {
                    id: n._id,
                    title: n.title,
                    message: n.message,
                    usersRead: n.usersRead ?? [],
                    read: Boolean(readEntry),
                    time: formatDistanceToNow(new Date(n.time), {
                        addSuffix: true,
                        locale: sv,
                    }),
                    type: n.type,
                };
            });

            set({ notifications: normalized });
        } catch (error) {
            console.error('❌ Failed to fetch notifications from Sanity:', error);
        }
    };

    const init = (userId: string) => {
        if (listener) return;

        listener = client
            .listen(`*[_type == "notification"]`, {}, { includeResult: false })
            .subscribe((update) => {
                //@ts-ignore
                if (update.transition === 'appear') {
                    fetchNotifications(userId);
                }
            });
    };

    const markAsRead = async (id: string, userId: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? {...n, read: true} : n
            ),
        }));

        try {
            // جلب الوثيقة أولاً
            const doc = await client.getDocument(id);

            // نسخ قائمة usersRead أو إنشاء واحدة جديدة
            const usersRead = doc?.usersRead || [];

            // البحث عن userId
            const index = usersRead.findIndex((entry: any) => entry.userId === userId);

            if (index !== -1) {
                // تحديث العنصر
                usersRead[index] = {
                    ...usersRead[index],
                    read: true,
                    readAt: new Date().toISOString(),
                    _key: Date.now().toString(),
                };
            } else {
                // إضافة عنصر جديد
                usersRead.push({
                    _key: Date.now().toString(),
                    userId,
                    read: true,
                    readAt: new Date().toISOString(),
                });
            }

            // تحديث الوثيقة
            await client
                .patch(id)
                .set({usersRead})
                .commit();
        } catch (error) {
            console.error('❌ Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async (userId: string) => {
        const unread = get().notifications.filter((n) => !n.read);

        set((state) => ({
            notifications: state.notifications.map((n) => ({...n, read: true})),
        }));

        try {
            await Promise.all(
                unread.map(async (n) => {
                    const doc = await client.getDocument(n.id);
                    const usersRead = doc?.usersRead || [];
                    const index = usersRead.findIndex((entry: any) => entry.userId === userId);

                    if (index !== -1) {
                        usersRead[index] = {
                            ...usersRead[index],
                            read: true,
                            readAt: new Date().toISOString(),
                            _key: Date.now().toString(),
                        };
                    } else {
                        usersRead.push({
                            _key: Date.now().toString(),
                            userId,
                            read: true,
                            readAt: new Date().toISOString(),
                        });
                    }

                    await client.patch(n.id).set({usersRead}).commit();
                })
            );
        } catch (error) {
            console.error('❌ Failed to mark all notifications as read:', error);
        }
    };

    const addNotification = (notification: Omit<NotificationType, 'read'>) =>
        set((state) => {
            const exists = state.notifications.some((n) => n.id === notification.id);
            if (exists) return state;
            return {
                notifications: [{...notification, read: false}, ...state.notifications],
            };
        });


    const hasUnread = () => get().notifications.some(n => !n.read);

    const setNotifications = (notifications: NotificationType[]) =>
        set({notifications});

    return {
        notifications: [],
        fetchNotifications,
        init,
        markAsRead,
        markAllAsRead,
        addNotification,
        hasUnread,
        setNotifications,
    };
});
