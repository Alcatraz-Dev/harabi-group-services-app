import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {discountedServicesItems} from '@/constants/discountedServicesItems';
import {StarIcon} from 'react-native-heroicons/solid';
import {useRouter} from 'expo-router';
import {ArrowRight} from "lucide-react-native";
import React from "react";
import {useAppTheme} from "@/hooks/useTheme";

export default function SpecialOffers() {
    const router = useRouter();
    const {theme: colorScheme} = useAppTheme();
    return (
        <View className="mt-8">
            <View className="flex flex-row justify-between px-1 my-5">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Erbjudanden för dig</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/categories')}
                    className="flex-row items-center gap-1"
                >
                    <Text className="text-gray-800 dark:text-white text-sm">Se alla</Text>
                    <ArrowRight size={12} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>
                </TouchableOpacity>
            </View>


            <FlatList
                data={discountedServicesItems}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: 16}}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/service/${item.id}`)}
                        className="mr-4 w-52 bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm"
                    >
                        <Image
                            source={{uri: item.image}}
                            className="w-full h-28"
                            resizeMode="cover"
                        />

                        <View className="p-3">
                            <Text className="text-base font-semibold text-gray-800 dark:text-white">
                                {item.title}
                            </Text>

                            <View className="flex-row items-center justify-between mt-1">
                                <Text className="text-sm font-bold text-red-600 line-through">
                                    {item.originalPrice} kr
                                </Text>
                                <Text className="text-sm font-bold text-green-700">
                                    {item.discountedPrice} kr
                                </Text>
                            </View>

                            <View className="flex-row items-center mt-1">
                                <StarIcon size={14} color="#fbbf24"/>
                                <Text className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                                    {item.rating}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}