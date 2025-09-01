import * as React from "react";
import {Image, View, Text, ActivityIndicator, TouchableOpacity} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {window} from "@/constants/sizes";
import {withAnchorPoint} from "@/utils/anchor-point";
import Animated, {useAnimatedStyle, interpolate, Extrapolation} from 'react-native-reanimated';
import imageUrlBuilder from "@sanity/image-url";
import {useEffect, useState} from "react";
import {client} from "@/client";
import {featuredServicesQuery} from "@/lib/queries";
import {ArrowRight} from "lucide-react-native";
import {useRouter} from "expo-router";
import {useAppTheme} from "@/hooks/useTheme";
//
// export const Items = [
//     {
//         title: "Top 100 Best Games",
//         image: "https://media.gq-magazine.co.uk/photos/645b5c3c8223a5c3801b8b26/16:9/w_2560%2Cc_limit/100-best-games-hp-b.jpg",
//     },
//     {
//         title: "The Crew Motorfest",
//         image: "https://gmedia.playstation.com/is/image/SIEPDC/the-crew-motorfest-hero-banner-desktop-01-en-30may23?$native$",
//     },
//     {
//         title: "Car Racing Game",
//         image: "https://imgs.crazygames.com/car-games-car-racing-game_16x9/20240628180656/car-games-car-racing-game_16x9-cover?metadata=none&quality=40&width=1200&height=630&fit=crop",
//     },
//
//     {
//         title: "Grand Theft Auto V",
//         image: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
//     },
//     {
//         title: "The Witcher 3: Wild Hunt",
//         image: "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
//     },
//
//
// ];

const PAGE_WIDTH = 90;
const CARD_WIDTH = 70;
const IMAGE_HEIGHT = 60;
const CARD_HEIGHT = 100; // ارتفاع يكفي للصورة + العنوان
const urlFor = (source: any) => builder.image(source).width(400).url();
const builder = imageUrlBuilder(client);
const ImageItemsComponent = ({
                                 item,
                                 animationValue,
                             }: {
    item: Service;
    animationValue: Animated.SharedValue<number>;
}) => {

    const imageUri = urlFor(item.image);


    const overlayStyle = useAnimatedStyle(() => {
        // نستخدم absolute value لنحدد مدى قرب العنصر من المركز
        const distance = Math.abs(animationValue.value);

        // اجعل العنصر واضح إذا كان في المركز أو على الجانبين القريبين
        const darkness = interpolate(
            distance,
            [0, 1, 1.1],
            [0, 0, 0.6], // كل ما هو أبعد من المركز+1 يصبح أغمق
            Extrapolation.CLAMP
        );

        return {
            backgroundColor: "black",
            opacity: darkness,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        };
    });

    return (
        <View
            className="rounded-xl overflow-hidden items-center  "
            style={{width: CARD_WIDTH, height: CARD_HEIGHT}}
        >
            <View className="relative w-full overflow-hidden rounded-xl " style={{height: IMAGE_HEIGHT}}>
                <Image
                    source={{uri: imageUri}}
                    resizeMode="cover"
                    className="w-full h-full"
                />
                <Animated.View style={overlayStyle}/>
                {/*/!*{item.badges?.[0] && (*!/*/}
                {/*/!*    <View*!/*/}
                {/*/!*        className="absolute top-1 left-1 bg-neutral-900/50 px-2 py-1 rounded-full"*!/*/}

                {/*/!*    >*!/*/}
                {/*/!*        <Text className="text-white text-[5px] font-bold">{item.badges[0]}</Text>*!/*/}
                {/*/!*    </View>*!/*/}
                {/*)}*/}
            </View>

        </View>
    );
};
type Service = {
    _id: string;
    title: string;
    image: any;
    description: string;
    slug: { current: string };
    badges?: string[];
};

function Carousel3D() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const router = useRouter();
    const {theme: colorScheme} = useAppTheme();

    useEffect(() => {
        setLoading(true);
        client.fetch(featuredServicesQuery).then(setServices).then(() =>
            setLoading(false)
        );


    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-neutral-100 dark:bg-neutral-900">
                <ActivityIndicator size="large" color="#4b5563"/>
            </View>
        );

    }
    const baseOptions = {
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH * 0.9,
    } as const;

    return (
        <>
            <View className="flex flex-row justify-between px-1 my-5">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">Våra tjänster</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/categories')}
                    className="flex-row items-center gap-1"
                >

                </TouchableOpacity>
            </View>
            <View
                style={{
                    alignItems: "center",
                }}
                id="carousel-component"
                // @ts-ignore
                dataSet={{kind: "custom-animations", name: "curve"}}
                className={' h-[200px] w-full items-center justify-center ml-5 '}

            >


                <Carousel
                    {...baseOptions}
                    loop
                    style={{
                        height: window.width / 2,
                        width: window.width,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    autoPlayInterval={150}
                    onSnapToItem={index => setActiveIndex(index)} // ✅ track active index
                    scrollAnimationDuration={600}
                    customAnimation={(value: number) => {
                        "worklet";
                        const size = PAGE_WIDTH;

                        // Bigger scale at center (value=0), smaller on sides
                        const scale = interpolate(
                            value,
                            [-2, -1, 0, 1, 2],
                            [1.0, 1.3, 2.2, 1.3, 1.0],  // Center is 2.2 scale, sides smaller
                            Extrapolation.CLAMP,
                        );

                        // Position images with flipped curve (outside curve)
                        const translateX = interpolate(
                            value,
                            [-2, -2, 0, 1, 2],
                            [size * 1.2, size * 1.2, 0, -size * 0.9, -size * 1.6], Extrapolation.CLAMP
                        );


                        // Rotate side images, keep center facing front (0deg)
                        const rotateY = interpolate(
                            value,
                            [-1, 0, 1],
                            [-30, 0, 30],
                            Extrapolation.CLAMP,
                        );

                        // Increase zIndex for center image to be on top
                        const zIndex = interpolate(
                            value,
                            [-1, 0, 1],
                            [0, 10, 0],
                            Extrapolation.CLAMP,
                        );

                        const transform = {
                            transform: [
                                {scale},
                                {translateX},
                                {perspective: 150},
                                {rotateY: `${rotateY}deg`},
                            ],
                            zIndex,
                        };

                        return {
                            ...withAnchorPoint(
                                transform,
                                {x: 0.5, y: 0.5},
                                {
                                    width: PAGE_WIDTH,
                                    height: PAGE_WIDTH * 0.6,
                                },
                            ),
                        };
                    }}
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 50,
                    }}
                    data={services}
                    // renderItem={({index}) => <ImageItemsComponent index={index}/>}
                    renderItem={({index, animationValue}) => (
                        <ImageItemsComponent item={services[index]} animationValue={animationValue}/>
                    )}
                />
                <Text
                    className="text-md font-bold text-center text-black dark:text-white   absolute w-full right-5 bottom-7"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {services[activeIndex]?.title}

                </Text>

            </View>
        </>
    );
}

export default Carousel3D;

