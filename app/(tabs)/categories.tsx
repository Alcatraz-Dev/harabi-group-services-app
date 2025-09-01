import {View, Text, FlatList, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftCircle} from 'lucide-react-native';
import {useRouter} from 'expo-router';
import {useAppTheme} from "@/hooks/useTheme";
import Animated, {FadeInDown, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {client} from "@/client";
import {categoriesQuery} from "@/lib/queries";


const CategoryItem = ({index,  id, title , description, slug, icon, coverImage, useCoverImageAsIcon , providerId}: {
    index: number;
    id: string,
    title: string,
    description: string,
    icon: string,
    slug: string
    coverImage: any,
    useCoverImageAsIcon: boolean;
    providerId: string
}) => {
    const router = useRouter();
    const scale = useSharedValue(1);
    const path = '/(categoryDetails)/category-details'
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
    }));

    const coverImageSource: ImageSourcePropType =
        typeof coverImage === 'string' ? {uri: coverImage} : (coverImage as ImageSourcePropType) ;



    const handlePress = () => {
        // تصغير العنصر
        scale.value = withTiming(0.95, {duration: 100});

        setTimeout(() => {
            scale.value = withTiming(1, {duration: 100}); // نرجع للحجم الطبيعي
            router.push({
                pathname: path,
                params: {
                    id ,
                    title,
                    icon ,
                    coverImage,
                    description,
                    slug,
                    useCoverImageAsIcon: useCoverImageAsIcon ? "false" : "true",
                    providerId
                },
            });
        }, 120);
    };


    return (
        <TouchableOpacity onPress={handlePress}>
            <Animated.View
                style={animatedStyle}
                // @ts-ignore
                entering={FadeInDown.delay(200 * id)}
                className="flex-row gap-6 items-center p-4 border-b border-gray-200 dark:border-gray-800"
            >
                <Animated.Image sharedTransitionTag={title} source={coverImageSource}
                                className="w-[80px] h-[80px] rounded-md" resizeMode="cover"/>
                <View className="flex-1 mb-5">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tryck för att se detaljer</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const Categories = () => {
    const router = useRouter();
    const {theme: colorScheme} = useAppTheme();
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await client.fetch(categoriesQuery);
            setCategories(data);
        };
        fetchCategories();
    }, []);
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="flex-row items-center justify-between px-5 py-4 mb-6">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <ArrowLeftCircle
                        size={25}
                        color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                    />
                </TouchableOpacity>
                <Text className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    Kategorier
                </Text>
                <View style={{width: 28}}/>
            </View>
            <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({item, index}) => (
                    <CategoryItem
                        id={item._id}
                        title={item.title}
                        description={item.description}
                        slug={item.slug?.current ?? ''}
                        icon={item.icon}
                        coverImage={item.coverImage}
                        useCoverImageAsIcon={true}
                        index={index}
                        providerId={item.provider?._id}
                    />
                )}
                contentContainerStyle={{paddingBottom: 24}}

            />
        </SafeAreaView>
    );
};

export default Categories;