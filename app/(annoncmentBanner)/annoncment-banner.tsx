import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftCircle, Megaphone} from 'lucide-react-native';
import {useRouter} from 'expo-router';
import {useAppTheme} from '@/hooks/useTheme';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sv';
import {client} from "@/client";
import {formatTime} from "@/utils/formatNotificationTime";

dayjs.extend(relativeTime);
dayjs.locale('sv'); // السويدية
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


const AnnouncementItem = ({
                              id,
                              slug,
                              image,
                              title,
                              subtitle,
                              description,
                              date,
                              isNew,
                              link

                          }: Announcement) => {
    const router = useRouter();
    return (
        <View className="flex-row items-start gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
            <View className="mt-1">
                <Megaphone size={24} color="#60a5fa"/>
            </View>

            <TouchableOpacity onPress={() => router.push(`/(annoncmentBanner)/${slug}`)} className="flex-1">
                <View className="flex-row items-center gap-2">
                    <Text className="text-base font-bold text-gray-900 dark:text-white">
                        {title}
                    </Text>
                    {isNew && (
                        <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                            <Text className="text-xs text-blue-600">Ny</Text>
                        </View>
                    )}
                </View>

                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subtitle}
                </Text>

                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {formatTime(date)}
                </Text>

                {image && (
                    <Image
                        source={{uri: image}}
                        className="w-full h-40 rounded-xl mt-3"
                        resizeMode="cover"
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

const AnnoncmentBanner = () => {
    const {theme: colorScheme} = useAppTheme();
    const router = useRouter();
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
            date
          }
        `);

                const data = response.map((item: any) => ({
                    id: item._id,
                    title: item.title,
                    subtitle: item.subtitle,
                    slug: item.slug?.current ?? '',
                    image: item.image?.asset?.url ?? null,
                    date: item.date,
                }));

                setBanners(data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };

        fetchBanners();
    }, []);
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
            <View className="flex-row items-center justify-between px-5 py-4 mb-4">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <ArrowLeftCircle
                        size={25}
                        color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                    />
                </TouchableOpacity>

                <Text className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    Alla Reklam
                </Text>

                <View style={{width: 28}}/>
            </View>

            <FlatList
                data={banners}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnnouncementItem
                        id={item.id}
                        image={item.image}
                        slug={item.slug}
                        title={item.title}
                        subtitle={item.subtitle}
                        description={item.description}
                        link={item.link}
                        date={item.date}
                        isNew={dayjs().diff(dayjs(item.date), 'day') <= 2}
                    />
                )}
                contentContainerStyle={{paddingBottom: 24}}
            />
        </SafeAreaView>
    );
};

export default AnnoncmentBanner;