import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking,
    Share,
    Alert, ImageSourcePropType,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ArrowLeftCircle, Phone, MessageCircle, Share2} from 'lucide-react-native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import ReviewsCard from "@/components/ReviewsCard";
import {SafeAreaView} from "react-native-safe-area-context";
import ReviewModal from "@/components/ui/BottomSheetReview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {client} from "@/client";
import {providerQuery} from "@/lib/queries";


const CategoryDetailsById = () => {
    const {slug, coverImage, title, description, icon, useCoverImageAsIcon, id, providerId,} = useLocalSearchParams();
    const router = useRouter();

    const imageSource: ImageSourcePropType =
        typeof coverImage === 'string' ? {uri: coverImage} : (coverImage as ImageSourcePropType);


    if (!slug) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                    Kategori hittades inte
                </Text>
            </View>
        );
    }

    const imageScale = useSharedValue(0.85);
    const imageOpacity = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);
    const backButtonOpacity = useSharedValue(0);
    const backButtonScale = useSharedValue(0.8);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);
    const descriptionOpacity = useSharedValue(0);
    const descriptionTranslateY = useSharedValue(20);

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: imageScale.value}],
        opacity: imageOpacity.value,
    }));

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const backButtonAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backButtonOpacity.value,
        transform: [{scale: backButtonScale.value}],
    }));

    const titleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{translateY: titleTranslateY.value}],
    }));

    const descriptionAnimatedStyle = useAnimatedStyle(() => ({
        opacity: descriptionOpacity.value,
        transform: [{translateY: descriptionTranslateY.value}],
    }));

    useEffect(() => {
        imageScale.value = withTiming(1, {duration: 1200, easing: Easing.out(Easing.exp)});
        imageOpacity.value = withTiming(1, {duration: 1200});
        overlayOpacity.value = withDelay(600, withTiming(0.4, {duration: 1000}));
        backButtonOpacity.value = withDelay(1100, withTiming(1, {duration: 800}));
        backButtonScale.value = withDelay(1100, withTiming(1, {duration: 800, easing: Easing.out(Easing.exp)}));
        titleOpacity.value = withDelay(1600, withTiming(1, {duration: 900}));
        titleTranslateY.value = withDelay(1600, withTiming(0, {duration: 900, easing: Easing.out(Easing.exp)}));
        descriptionOpacity.value = withDelay(2100, withTiming(1, {duration: 900}));
        descriptionTranslateY.value = withDelay(2100, withTiming(0, {duration: 900, easing: Easing.out(Easing.exp)}));
    }, []);

    // Provider data

    const [provider, setProvider] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        if (!providerId) return;
        const query = `*[_type == "provider" && _id == $id][0]{
                _id,
                name,
                slug,
                description,
                avatar {
                  asset->{
                    _id,
                    url
                  }
                },
                role,
                roleResponsibilities,
                phoneNumber,
                whatsappNumber
            }`;
        client.fetch(query, {id: providerId}).then(setProvider);

    }, [providerId]);

    if (!provider) return <Text>Laddar...</Text>;

    const whatsappNumber = provider.whatsappNumber;
    const phoneNumber = provider.phoneNumber;


    const handleGoBack = () => {
        backButtonScale.value = withTiming(0.8, {duration: 100}, () => {
            backButtonScale.value = withTiming(1, {duration: 150}, () => {
                runOnJS(router.back)();
            });
        });
    };

    const handleCall = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleChat = () => {
        const message = encodeURIComponent("Hej! Jag är intresserad av er tjänst och vill gärna få mer information.");
        const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Fel', 'Det gick inte att öppna WhatsApp.');
        });
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Kolla in den här tjänsten: ${title}`,
            });
        } catch (error) {
            Alert.alert('Fel', 'Det gick inte att dela tjänsten.');
        }
    };

    // BottomSheet & Review
    const handleLeaveReview = () => {
        setModalVisible(true);
    };

    const handleBooking = async () => {
        try {
            const newBooking = {
                id,
                coverImage,
                title,
                bookedAt: new Date().toISOString(),
                status: 'in progress',
                name: 'Kundens Namn',
                totalAmount: 250,
            };

            const existingData = await AsyncStorage.getItem('bookingList');
            const existingList = existingData ? JSON.parse(existingData) : [];

            const updatedList = [newBooking, ...existingList];

            await AsyncStorage.setItem('bookingList', JSON.stringify(updatedList));

            Alert.alert('Success', 'Din bokning har sparats!');
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert('Fel', 'Det gick inte att spara bokningen.');
        }
    };
    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Animated.View
                style={[imageAnimatedStyle]}
                className="relative w-full h-[400px] mb-6 rounded-b-2xl overflow-hidden"
            >
                <Animated.Image style={[imageAnimatedStyle]} source={imageSource} className="w-full h-full"
                                resizeMode="cover"/>
                <Animated.View
                    style={[overlayAnimatedStyle]}
                    className="absolute inset-0 bg-black rounded-b-2xl"
                />
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="absolute top-16 left-4 z-10"
                    accessibilityLabel="Go back"
                >
                    <Animated.View style={backButtonAnimatedStyle}>
                        <ArrowLeftCircle size={30} color="white"/>
                    </Animated.View>
                </TouchableOpacity>
                <View className="flex-1 justify-end items-center pb-6 absolute bottom-0 left-0 right-0">
                    <Animated.Text
                        style={titleAnimatedStyle}
                        className="text-white text-2xl font-extrabold text-center px-4"
                    >
                        {title}
                    </Animated.Text>
                </View>
            </Animated.View>

            <ScrollView contentContainerStyle={{paddingBottom: 40}} className="px-4">
                <View className={'mt-3 mb-5  '}>
                    <Text className="text-lg font-semibold text-black dark:text-white mb-2 ml-2">Reviews</Text>
                    <StarRatingDisplay rating={4.5} starSize={20} color="#FF9F00"/>
                    <Text className="text-xs text-gray-600 dark:text-gray-300 my-2 ml-2">4.5 out of 5 (10
                        reviews)</Text>
                </View>

                <Text className="font-bold text-black dark:text-white mb-3 text-xl">Description</Text>
                <Animated.Text
                    style={descriptionAnimatedStyle}
                    className="text-base text-gray-700 dark:text-gray-200 leading-6"
                >
                    Här hittar du alla tjänster relaterade till{' '}
                    <Text className="font-semibold text-black dark:text-white">{title}</Text>.
                    {description}
                </Animated.Text>

                {/* Action Buttons */}
                <View className="flex-row justify-around mt-6">
                    <TouchableOpacity onPress={handleCall} className="items-center">
                        <Phone size={24} color="#1E90FF"/>
                        <Text className="text-sm text-blue-600 mt-1">Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChat} className="items-center">
                        <MessageCircle size={24} color="#32CD32"/>
                        <Text className="text-sm text-green-600 mt-1">Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} className="items-center">
                        <Share2 size={24} color="#FF8C00"/>
                        <Text className="text-sm text-orange-600 mt-1">Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Provider Information */}
                <View className="h-[1px] bg-neutral-200 dark:bg-neutral-700 mb-3 mt-5"/>


                <TouchableOpacity onPress={
                    () => {
                        router.push({
                            // @ts-ignore
                            pathname: `/(provider)/${provider.slug}`,
                            params: {
                                providerId: provider._id,
                            },
                        });
                    }
                } key={provider._id} className="flex-row items-center p-4">
                    <Image
                        source={{uri: provider.avatar?.asset?.url || 'https://avatar.iran.liara.run/public/boy'}}
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <View>
                        <Text className="text-lg font-semibold text-black dark:text-white">
                            {provider.name}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-300">
                            {provider.role}
                        </Text>
                    </View>
                </TouchableOpacity>


                <View className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-3"/>

                {/* Reviews */}
                <View className="my-6 px-2">

                    <ReviewsCard/>

                </View>

            </ScrollView>
            <SafeAreaView>
                <View className="flex-row space-x-4 gap-x-6 pb-6 px-4">
                    {/* Leave Review Button */}
                    <TouchableOpacity
                        onPress={handleLeaveReview}
                        className="bg-blue-600  flex-1 p-3  rounded-full items-center"
                    >
                        <Text className="text-white font-semibold text-lg">Lämna en recension</Text>
                    </TouchableOpacity>

                    <ReviewModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />

                    {/* Booking Button */}
                    <TouchableOpacity
                        onPress={handleBooking}
                        className="flex-1 p-3 bg-green-600 rounded-full items-center"
                    >
                        <Text className="text-white font-semibold text-lg">Book Now</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        </View>
    );
};

export default CategoryDetailsById;