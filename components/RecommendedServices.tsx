import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { StarIcon } from 'react-native-heroicons/solid';
import { recommendedServicesItems } from '@/constants/recommendedServicesItems';
import {ArrowRight} from "lucide-react-native";
import React from "react";
import {useAppTheme} from "@/hooks/useTheme";

export default function RecommendedServices() {
    const { theme: colorScheme } = useAppTheme();
    return (
        <View className="my-4 ">
            <View className="flex flex-row justify-between px-1 mt-5 mb-10">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Rekommenderade tjänster för dig</Text>
                <TouchableOpacity
                    onPress={() => console.log('See all')}
                    className="flex-row items-center gap-1"
                >
                    <Text className="text-gray-800 dark:text-white text-sm"> Se alla </Text>
                    <ArrowRight size={12} color={colorScheme === 'dark' ? 'white' : '#4b5563'} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={recommendedServicesItems}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                renderItem={({ item }) => (
                    <TouchableOpacity className="mr-4 w-48 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-5">
                        <Image
                            source={{ uri: item.image }}
                            className="w-full h-28 rounded-t-2xl"
                            resizeMode="cover"
                        />

                        <View className="p-3">
                            <Text className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                                {item.title}
                            </Text>

                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm font-medium text-green-600">
                                    {item.price} kr
                                </Text>

                                <View className="flex-row items-center">
                                    <StarIcon size={14} color="#fbbf24" />
                                    <Text className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                                        {item.rating}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}