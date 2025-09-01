import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app_theme';

export function useAppTheme() {
    const { colorScheme, setColorScheme } = useColorScheme();

    // Load saved theme on mount
    useEffect(() => {
        (async () => {
            const storedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (storedTheme === 'light' || storedTheme === 'dark') {
                setColorScheme(storedTheme);
            } else if (storedTheme === 'system') {
                const systemTheme = Appearance.getColorScheme();
                setColorScheme(systemTheme ?? 'light');
            }
        })();
    }, []);

    const setTheme = async (theme: 'light' | 'dark' | 'system') => {
        await AsyncStorage.setItem(THEME_KEY, theme);

        if (theme === 'system') {
            const systemTheme = Appearance.getColorScheme();
            setColorScheme(systemTheme ?? 'light');
        } else {
            setColorScheme(theme);
        }
    };

    return {
        theme: colorScheme,
        setTheme,
    };
}