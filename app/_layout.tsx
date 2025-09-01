import {ClerkProvider, useUser} from '@clerk/clerk-expo';
import {Slot} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import './global.css';
import {useColorScheme} from 'nativewind';
import {Appearance, View, ActivityIndicator} from 'react-native';
import {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import useSanityNotifications from '@/hooks/useSanityNotification';
import {
    requestPermissions,
    setupNotifications,

} from '@/lib/notifications';
import {registerForPushNotificationsAsync, savePushTokenToServer} from "@/utils/notifications";

global.Buffer = Buffer;

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ThemeInitializer() {
    const {user, isLoaded} = useUser();
    const {setColorScheme} = useColorScheme();
    const [themeReady, setThemeReady] = useState(false);

    useEffect(() => {
        async function registerAndSaveToken() {
            const token = await registerForPushNotificationsAsync();
            if (token && user?.id) {
                await savePushTokenToServer(token, user?.id);
            }
        }

        if (isLoaded && user?.id) {
            registerAndSaveToken();
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (!isLoaded) return;

        const preferredTheme = user?.unsafeMetadata?.theme as 'light' | 'dark' | 'system';

        if (preferredTheme === 'system') {
            const systemTheme = Appearance.getColorScheme();
            setColorScheme(systemTheme ?? 'light');
        } else if (preferredTheme) {
            setColorScheme(preferredTheme);
        }

        setThemeReady(true);
    }, [isLoaded]);

    if (!isLoaded || !themeReady) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#007AFF"/>
            </View>
        );
    }

    return <Slot/>;
}

export default function Layout() {
    useSanityNotifications();

    useEffect(() => {
        setupNotifications();
        requestPermissions();
    }, []);


    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <BottomSheetModalProvider>
                <ClerkProvider
                    publishableKey={CLERK_PUBLISHABLE_KEY}
                    tokenCache={{
                        async getToken(key) {
                            return SecureStore.getItemAsync(key);
                        },
                        async saveToken(key, value) {
                            return SecureStore.setItemAsync(key, value);
                        },
                    }}
                >
                    <View className="flex-1 bg-white dark:bg-black">
                        <ThemeInitializer/>
                    </View>
                </ClerkProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}