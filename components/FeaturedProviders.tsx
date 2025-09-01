import { View, Text, FlatList, Image } from 'react-native';
import { featuredProviders } from '@/constants/featuredProviders';
import { StarIcon, MapPinIcon } from 'react-native-heroicons/solid';

export default function FeaturedProviders() {
    return (
        <View className="mt-8">
            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Utvalda leverantörer
            </Text>

            <FlatList
                data={featuredProviders}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                renderItem={({ item }) => (
                    <View className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 mr-4 w-72 mb-5">
                        <View className="flex-row items-center ">
                            <Image
                                source={{ uri: item.avatar }}
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <View>
                                <Text className="text-base font-semibold text-gray-800 dark:text-white">
                                    {item.name}
                                </Text>
                                <View className="flex-row items-center gap-1">
                                    <MapPinIcon size={12} color="#6b7280" />
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.location}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row items-center mb-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon
                                    key={i}
                                    size={14}
                                    color={i < Math.floor(item.rating) ? '#facc15' : '#e5e7eb'}
                                />
                            ))}
                            <Text className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                {item.rating.toFixed(1)}
                            </Text>
                        </View>

                        <Text className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                            Tjänster: {item.services.join(', ')}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}