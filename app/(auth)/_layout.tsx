import { Stack, useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useColorScheme } from 'nativewind';
import { Appearance, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {checkUserExistsInSanity} from "@/lib/syncUserToSanity";


export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth();
    const { user, isLoaded } = useUser();
    const { setColorScheme } = useColorScheme();
    const [themeReady, setThemeReady] = useState(false);
    const router = useRouter();

    // 1. Apply theme based on user preference
    useEffect(() => {
        if (!isLoaded) return;

        const preferredTheme = user?.unsafeMetadata?.theme as
            | 'light'
            | 'dark'
            | 'system';

        if (preferredTheme === 'system') {
            const systemTheme = Appearance.getColorScheme();
            setColorScheme(systemTheme ?? 'light');
        } else if (preferredTheme) {
            setColorScheme(preferredTheme);
        }

        setThemeReady(true);
    }, [isLoaded]);

    // 2. Handle redirection based on profile + Sanity status
    useEffect(() => {
        const checkProfileStatus = async () => {
            if (!isLoaded || !themeReady) return;

            if (isSignedIn && user) {
                // 🔑 Check if user exists in Sanity
                const exists = await checkUserExistsInSanity(user.id);

                if (!exists) {
                    // If user is missing in Sanity → go to complete profile
                    router.replace('/complete-profile');
                    return;
                }

                // If user exists in Sanity, then check local profileCompleted flag
                const completed = await AsyncStorage.getItem('profileCompleted');
                if (completed === 'true') {
                    router.replace('/(tabs)/home');
                } else {
                    router.replace('/complete-profile');
                }
            } else {
                router.replace('/(auth)/sign-in');
            }
        };

        checkProfileStatus();
    }, [isLoaded, themeReady, isSignedIn]);

    // 3. Show loading screen while waiting
    if (!isLoaded || !themeReady) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}