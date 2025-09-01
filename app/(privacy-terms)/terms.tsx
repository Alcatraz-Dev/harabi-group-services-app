import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useRouter} from 'expo-router';
import {useAppTheme} from '@/hooks/useTheme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftCircle} from 'lucide-react-native';

const Terms = () => {
    const router = useRouter();
    const { theme: colorScheme } = useAppTheme();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-10">
                <View className=" flex flex-row justify-between ">
                    <ArrowLeftCircle size={25} color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                                     onPress={() => router.back()}/>
                </View>
                <Text className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    Användarvillkor
                </Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 py-6">
                <Text className="text-gray-800 dark:text-gray-200 text-base leading-6 mb-4">
                    Genom att använda vår app godkänner du följande villkor. Läs dessa noggrant innan du fortsätter.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    1. Användning av tjänsten
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Appen får endast användas i enlighet med gällande lagar och för avsedda ändamål. Otillåten användning kan leda till avstängning.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    2. Kontoinformation
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Du ansvarar för att hålla dina kontouppgifter säkra. Vid misstanke om obehörig åtkomst, kontakta oss omedelbart.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    3. Ansvarsbegränsning
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Vi ansvarar inte för direkta eller indirekta skador som kan uppstå vid användning av appen.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    4. Ändringar i villkor
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Vi förbehåller oss rätten att uppdatera villkoren när som helst. Det är ditt ansvar att hålla dig informerad.
                </Text>

                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-8">
                    Senast uppdaterad: Maj 2025
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Terms;