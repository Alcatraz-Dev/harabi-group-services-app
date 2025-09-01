import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftCircle} from 'lucide-react-native';
import {useRouter} from 'expo-router';
import {useAppTheme} from '@/hooks/useTheme';

const Privacy = () => {
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
                    Sekretesspolicy
                </Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 py-6">
                <Text className="text-gray-800 dark:text-gray-200 text-base leading-6 mb-4">
                    Vi tar din integritet på största allvar. Denna sekretesspolicy beskriver hur vi samlar in, använder
                    och skyddar dina personuppgifter när du använder vår app.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    1. Insamling av information
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Vi samlar in information som du tillhandahåller direkt, såsom namn, e-postadress och plats.
                    Vi samlar också in teknisk information om din enhet och användarbeteende i appen.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    2. Användning av information
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Informationen används för att förbättra användarupplevelsen, anpassa innehåll och kommunicera med dig.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    3. Delning av information
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Vi delar inte dina personuppgifter med tredje part utan ditt samtycke, förutom när det krävs enligt lag.
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    4. Dina rättigheter
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 mb-4">
                    Du har rätt att begära åtkomst till, rätta eller radera dina personuppgifter.
                    Kontakta oss via appens supportfunktion för att utöva dina rättigheter.
                </Text>

                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-8">
                    Denna policy kan uppdateras. Senaste uppdatering: Maj 2025.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Privacy;