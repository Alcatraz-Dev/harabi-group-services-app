import React, {useRef, useEffect, useState} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableOpacity,
    Pressable
} from 'react-native';
import {ArrowRight} from "lucide-react-native";
import {useAppTheme} from "@/hooks/useTheme";
import {useRouter} from 'expo-router';

import {LinearGradient} from 'expo-linear-gradient';
import {client} from "@/client";

const {width} = Dimensions.get('window');
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

const AutoCarouselBanner = () => {
    const scrollRef = useRef<ScrollView>(null);
    const currentIndex = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
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
    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(() => {
            const nextIndex = (currentIndex.current + 1) % banners.length;
            scrollRef.current?.scrollTo({x: nextIndex * width, animated: true});
            currentIndex.current = nextIndex;
            setActiveIndex(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        currentIndex.current = index;
        setActiveIndex(index);
    };

    return (
        <View className="mt-2">
            <View className="flex flex-row justify-between px-1">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Reklam</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(annoncmentBanner)/annoncment-banner')}
                    className="flex-row items-center gap-1"
                >
                    <Text className="text-gray-800 dark:text-white text-sm">Se alla</Text>
                    <ArrowRight size={12} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>
                </TouchableOpacity>
            </View>

            <View className="mt-4 rounded-2xl overflow-hidden">
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onScrollEnd}
                >
                    {banners.map((banner) => {
                        const createdAt = new Date(banner.date);
                        const now = new Date();
                        const isNew = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) < 7;

                        return (
                            <View
                                key={banner.id}
                                className="relative"
                                style={{width, height: 200}}
                            >
                                <Image
                                    //@ts-ignore
                                    source={banner.image ? {uri: banner.image} : banner.image}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />

                                {/* Gradient overlay */}
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={{position: 'absolute', bottom: 0, height: '60%', width: '100%'}}
                                />

                                {/* NEW badge */}
                                {isNew && (
                                    <View
                                        className="absolute top-3 left-3 bg-green-600 px-3 py-1 rounded-full shadow-lg z-10 my-2">
                                        <Text className="text-white text-xs font-bold uppercase">Ny</Text>
                                    </View>
                                )}

                                {/* Text & CTA */}
                                <View className="absolute top-16 left-4 right-4">
                                    <Text className="text-white text-lg font-extrabold mb-1">{banner.title}</Text>
                                    <Text className="text-gray-200 text-sm mb-2">{banner.subtitle}</Text>
                                    <TouchableOpacity
                                        className="bg-white/90 px-3 py-1.5 rounded-full self-start my-3"
                                        onPress={() => router.push(`/(annoncmentBanner)/${banner.slug}`)}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Läs mer om ${banner.title}`}
                                    >
                                        <Text className="text-black text-xs font-semibold">Läs mer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Dots */}
                <View className="absolute bottom-3 w-full flex-row justify-center items-center space-x-2 gap-1">
                    {banners.map((_, i) => (
                        <View
                            key={i}
                            className={`h-2 rounded-full transition-all mb-2 ${
                                i === activeIndex ? 'bg-white w-5' : 'bg-white/40 w-2'
                            }`}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

export default AutoCarouselBanner;