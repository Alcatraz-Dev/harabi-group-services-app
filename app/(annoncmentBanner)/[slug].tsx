import React, {useEffect , useState} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftCircle, Megaphone} from 'lucide-react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {useAppTheme} from '@/hooks/useTheme';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sv';
import {client} from "@/client";
import {formatTime} from "@/utils/formatNotificationTime";

dayjs.extend(relativeTime);
dayjs.locale('sv');
type Announcement = {
    id: string;
    slug: string;
    image: string | null;
    title: string;
    subtitle: string;
    description: string;
    date: string;
    isNew?: boolean;
    link: string
};
const BannerDetailbySlug = () => {
    const {theme: colorScheme} = useAppTheme();
    const router = useRouter();
    const {slug} = useLocalSearchParams();
    const [banners, setBanners] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await client.fetch(`
                    *[_type == "announcement"] | order(date desc) {
                        _id,
                        title,
                        subtitle,
                        slug {
                            current
                        },
                        image {
                            asset -> {
                                url
                            }
                        },
                        date,
                        description,
                        link
                    }
                `);

                const data = response.map((item: any) => ({
                    id: item._id,
                    title: item.title,
                    subtitle: item.subtitle,
                    slug: item.slug?.current ?? '',
                    image: item.image?.asset?.url ?? null,
                    date: item.date,
                    description: item.description || '',
                    link: item.link || ''
                }));

                setBanners(data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };

        fetchBanners();
    }, []);

    // إيجاد الإعلان حسب السلاج
    const banner = banners.find(b => b.slug === slug);

    if (!banner) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
                <Text className="text-gray-600 dark:text-gray-300 text-lg">
                    Kunde inte hitta reklamen.
                </Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 rounded-md">
                    <Text className="text-white text-center">Tillbaka</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isNew = dayjs().diff(dayjs(banner.date), 'day') <= 7;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="flex-row items-center px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <ArrowLeftCircle
                        size={28}
                        color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                    />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-xl font-bold text-gray-900 dark:text-white">
                    Reklamdetaljer
                </Text>
                <View style={{width: 28}}/>
            </View>

            <ScrollView contentContainerStyle={{paddingBottom: 24}}>
                <View className="p-4">
                    <View className="relative rounded-xl overflow-hidden">
                        <Image

                            alt={banner.title}
                            // @ts-ignore
                            source={{uri: banner.image}}
                            className="w-full h-56"
                            resizeMode="cover"
                        />
                        {isNew && (
                            <View className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full z-10">
                                <Text className="text-white font-semibold text-xs">Ny</Text>
                            </View>
                        )}
                    </View>

                    <View className="mt-4">
                        <View className="flex-row items-center gap-2">
                            <Megaphone size={24} color="#3b82f6"/>
                            <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                {banner.title}
                            </Text>
                        </View>

                        <Text className="text-gray-600 dark:text-gray-300 mt-2 text-base">
                            {banner.subtitle}
                        </Text>

                        <Text className="text-gray-400 dark:text-gray-500 mt-1 text-sm">
                            {formatTime(banner.date)}
                        </Text>

                        <Text className="mt-4 text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                            {banner.description || 'Ingen beskrivning tillgänglig.'}
                        </Text>

                        {banner.link && (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(banner.link)}
                                className="mt-6 bg-blue-600 py-3 rounded-xl"
                            >
                                <Text className="text-white font-semibold text-center">
                                    Besök webbplats
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BannerDetailbySlug;