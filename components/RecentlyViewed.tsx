import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, View, Text, TouchableOpacity, Image } from 'react-native';
import {recommendedServicesItems} from "@/constants/recommendedServicesItems";

export default function RecentlyViewed() {
const [recentServices, setRecentServices] = useState(recommendedServicesItems as any);

    useEffect(() => {
        const fetchRecent = async () => {
            const jsonValue = await AsyncStorage.getItem('@recent_services');
            setRecentServices(jsonValue ? JSON.parse(jsonValue) : []);
        };
        fetchRecent();
    }, []);

    if (recentServices.length === 0) return null;

    return (
        <View className="mt-6">
            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-3">Senast visade tjänster</Text>
            <FlatList
                data={recentServices}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity className="mr-4 w-48 bg-white dark:bg-neutral-800 rounded-lg p-3 shadow" onPress={() => {
                        // قم بإعادة التوجيه إلى تفاصيل الخدمة
                    }}>
                        <Image source={{ uri: item.image as any }} style={{ resizeMode: 'cover' }} className="w-full h-24 rounded-md mb-2" />
                        <Text className="text-base font-semibold text-gray-900 dark:text-white">{item.text}</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-300">{item.price} kr</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}