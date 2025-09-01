import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Onboarding, useOnboarding} from 'react-native-app-onboard';
import {useRouter} from 'expo-router';
import {AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppTheme} from "@/hooks/useTheme";

const Pagination = () => {
    const {numberOfScreens, currentPage, nextPage} = useOnboarding();
    const router = useRouter();
    const {theme: colorScheme} = useAppTheme();
    const isDark = colorScheme === 'dark';

    const handlePress = async () => {
        if (currentPage === numberOfScreens - 1) {
            await AsyncStorage.setItem('onboarding_seen', 'true');
            router.push('/(tabs)/home');
        } else {
            nextPage();
        }
    };

    return (
        <View className="flex-row items-center justify-between w-full px-5 pb-8">
            <View className="flex-row items-center justify-center py-2">
                {Array.from({length: numberOfScreens}, (_, i) => (
                    <View
                        key={i}
                        className={`h-2 rounded-full mx-1 ${
                            i === currentPage
                                ? 'w-7 bg-blue-500'
                                : isDark
                                    ? 'w-2 bg-white/30'
                                    : 'w-2 bg-black/30'
                        }`}
                    />
                ))}
            </View>
            <TouchableOpacity
                onPress={handlePress}
                className="w-[62px] h-[62px] rounded-full bg-blue-500 justify-center items-center"
            >
                <AntDesign name="arrowright" size={24} color="white"/>
            </TouchableOpacity>
        </View>
    );
};

const OnboardingScreen = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const {theme: colorScheme} = useAppTheme();
    const isDark = colorScheme === 'dark';
    const key = useMemo(() => `onboarding-${colorScheme}`, [colorScheme]);

    useEffect(() => {
        const checkOnboarding = async () => {
            const seen = await AsyncStorage.getItem('onboarding_seen');
            if (seen === 'true') {
                router.replace('/(tabs)/home');
                return;
            }
            setLoading(false);
        };
        checkOnboarding();
    }, []);

    const pages = useMemo(
        () => [
            {
                backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                image: (
                    <Image
                        source={require('../../assets/images/onboarding1.png')}
                        className="w-[250px] h-[250px]"
                    />
                ),
                title: (
                    <Text
                        className={`text-center text-[22px] font-bold ${
                            isDark ? 'text-white' : 'text-black'
                        }`}
                    >
                        Find petcare around your location
                    </Text>
                ),
                subtitle: (
                    <Text
                        className={`text-center text-base ${
                            isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}
                    >
                        Just turn on your location and you will find the nearest pet care
                        you wish.
                    </Text>
                ),
            },
            {
                backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                image: (
                    <Image
                        source={require('../../assets/images/onboarding2.png')}
                        className="w-[250px] h-[250px]"
                    />
                ),
                title: (
                    <Text
                        className={`text-center text-[22px] font-bold ${
                            isDark ? 'text-white' : 'text-black'
                        }`}
                    >
                        Let us give the best treatment
                    </Text>
                ),
                subtitle: (
                    <Text
                        className={`text-center text-base ${
                            isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}
                    >
                        Get the best treatment for your animal with us.
                    </Text>
                ),
            },
            {
                backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                image: (
                    <Image
                        source={require('../../assets/images/onboarding3.png')}
                        className="w-[250px] h-[250px]"
                    />
                ),
                title: (
                    <Text
                        className={`text-center text-[22px] font-bold ${
                            isDark ? 'text-white' : 'text-black'
                        }`}
                    >
                        Book appointment with us!
                    </Text>
                ),
                subtitle: (
                    <Text
                        className={`text-center text-base ${
                            isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}
                    >
                        What do you think? Book our veterinarians now.
                    </Text>
                ),
            },
        ],
        [isDark]
    );

    if (loading) return null;

    return (
        <View className="flex-1">
            <Onboarding
                key={key}
                containerStyle={{
                    backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                }}
                showDone={true}
                showSkip={true}
                showPagination={true}
                onSkip={() => {
                    AsyncStorage.setItem('onboarding_seen', 'true');
                    router.push('/(tabs)/home')
                }}
                onDone={() => {
                    AsyncStorage.setItem('onboarding_seen', 'true');
                    router.push('/(tabs)/home');
                }}
                skipButtonPosition="top-right"
                skipLabel="Skip"
                skipButtonContainerStyle={{
                    position: 'absolute',
                    top: 60,
                    right: 20,
                    zIndex: 1,
                }}
                skipLabelStyle={{
                    color: isDark ? '#ccc' : '#555',
                    fontSize: 16,
                    textAlign: 'center',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                }}
                customFooter={Pagination}
                pages={pages as any}
            />
        </View>
    );
};

export default OnboardingScreen;