import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity} from 'react-native';
import {useRouter} from 'expo-router';
import {ArrowRight} from "lucide-react-native";
import {useAppTheme} from "@/hooks/useTheme";
import {client} from "@/client";
import {categoriesQuery} from "@/lib/queries";

const HorizontalCategoryList = () => {
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

    const categoryData = categories.map((cat) => ({
        id: cat._id,
        title: cat.title,
        icon: cat.icon,
        coverImage: cat.coverImage,
        description: cat.description,
        slug: cat.slug,
        useCoverImageAsIcon: cat.useCoverImageAsIcon,
        providerId: cat.provider?._id,
    }));
    const getImageSource = (urlOrObject: any) => {
        if (!urlOrObject) return null;
        return typeof urlOrObject === 'string' ? { uri: urlOrObject } : urlOrObject;
    };
    return (
        <View className="my-4 ">
            <View className="flex flex-row justify-between px-1 my-5">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Våra kategorier</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/categories')}
                    className="flex-row items-center gap-1"
                >
                    <Text className="text-gray-800 dark:text-white text-sm">Se alla</Text>
                    <ArrowRight size={12} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() =>
                            router.push({
                                // @ts-ignore
                                pathname: `/(categoryDetails)/${cat.slug}`,
                                params: {
                                    id: cat._id,
                                    title: cat.title,
                                    icon: cat.icon,
                                    coverImage: cat.coverImage,
                                    description: cat.description,
                                    slug: cat.slug,
                                    useCoverImageAsIcon: cat.useCoverImageAsIcon,
                                    providerId: cat.provider?._id,
                                },
                            })
                        }

                        className="items-center mr-4 mt-5"
                    >
                        <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
                            {cat.useCoverImageAsIcon
                                ? getImageSource(cat.coverImage) && (
                                <Image source={getImageSource(cat.coverImage)} className="w-full h-full" />
                            )
                                : getImageSource(cat.icon) && (
                                <Image source={getImageSource(cat.icon)} className="w-full h-full p-5" />
                            )}
                        </View>
                        <Text className=" text-xs text-gray-800 dark:text-white text-center mt-3 max-w-24 mb-5"
                              numberOfLines={1}>
                            {cat.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
//@ts-ignore

export default HorizontalCategoryList;