import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking,
    Share,
    Alert,
    ImageSourcePropType,
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from "react-native-reanimated";
import {useLocalSearchParams, useRouter} from "expo-router";
import {ArrowLeftCircle, Phone, MessageCircle, Share2} from "lucide-react-native";
import {StarRatingDisplay} from "react-native-star-rating-widget";
import ReviewsCard from "@/components/ReviewsCard";
import {SafeAreaView} from "react-native-safe-area-context";
import ReviewModal from "@/components/ui/BottomSheetReview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {client} from "@/client";
import {useAuth, useUser} from "@clerk/clerk-expo";

const CategoryDetails = () => {
    const {id, title, coverImage, description, providerId} = useLocalSearchParams();
    const router = useRouter();

    const imageSource: ImageSourcePropType =
        typeof coverImage === "string" ? {uri: coverImage} : (coverImage as ImageSourcePropType);

    // Animations
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

    const overlayAnimatedStyle = useAnimatedStyle(() => ({opacity: overlayOpacity.value}));
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
        backButtonScale.value = withDelay(
            1100,
            withTiming(1, {duration: 800, easing: Easing.out(Easing.exp)})
        );
        titleOpacity.value = withDelay(1600, withTiming(1, {duration: 900}));
        titleTranslateY.value = withDelay(
            1600,
            withTiming(0, {duration: 900, easing: Easing.out(Easing.exp)})
        );
        descriptionOpacity.value = withDelay(2100, withTiming(1, {duration: 900}));
        descriptionTranslateY.value = withDelay(
            2100,
            withTiming(0, {duration: 900, easing: Easing.out(Easing.exp)})
        );
    }, []);

    // Provider state
    const [provider, setProvider] = useState<any>(null);
    useEffect(() => {
        if (!providerId) return;
        const query = `*[_type == "provider" && _id == $id][0]{
      _id,
      name,
      slug,
      description,
      avatar { asset->{ url } },
      role,
      phoneNumber,
      whatsappNumber
    }`;
        client.fetch(query, {id: providerId}).then(setProvider);
    }, [providerId]);

    // Reviews state
    const [reviews, setReviews] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!id) return;
        const query = `*[_type == "review" && references($id)] | order(createdAt desc){
      _id,
      userEmail,
      userName,
      rating,
      comment,
      createdAt,
      avatar
    }`;
        client.fetch(query, {id}).then(setReviews);
    }, [id]);

    // Current user
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        const email = user.emailAddresses?.[0]?.emailAddress;
        if (!email) return;

        const fetchUser = async () => {
            try {
                // Use lower-case email to avoid case mismatch
                const result = await client.fetch(
                    `*[_type == "user" && lower(email) == $email][0]{
          _id,
          fullName,
          firstName,
          lastName,
          email,
          avatarUrl
        }`,
                    { email: email.toLowerCase() }
                );
                setCurrentUser(result);
            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };

        fetchUser();
    }, [user?.id]); // dependency is Clerk user ID
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

    const handleCall = () => Linking.openURL(`tel:${phoneNumber}`);

    const handleChat = () => {
        const message = encodeURIComponent(
            "Hej! Jag är intresserad av er tjänst och vill gärna få mer information."
        );
        const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${message}`;
        Linking.openURL(url).catch(() => Alert.alert("Fel", "Det gick inte att öppna WhatsApp."));
    };

    const handleShare = async () => {
        try {
            await Share.share({message: `Kolla in den här tjänsten: ${title}`});
        } catch (error) {
            Alert.alert("Fel", "Det gick inte att dela tjänsten.");
        }
    };

    const handleLeaveReview = () => setModalVisible(true);

    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!currentUser) {
            Alert.alert("Fel", "Användarinformation saknas.");
            return;
        }

        try {
            const existingReview = await client.fetch(
                `*[_type == "review" && userEmail == $email && category._ref == $categoryId][0]`,
                {email: currentUser.email, categoryId: id}
            );

            if (existingReview) {
                Alert.alert("Obs!", "Du har redan lämnat en recension för denna tjänst.");
                return;
            }

            const newReview = {
                _type: "review",
                userEmail: currentUser.email,
                userName: currentUser.fullName || currentUser.firstName || "Användare",
                rating,
                comment,
                category: {_type: "reference", _ref: id},
                provider: {_type: "reference", _ref: providerId},
                createdAt: new Date().toISOString(),
                avatar: currentUser.avatarUrl || "https://avatar.iran.liara.run/public/boy",
            };

            await client.create(newReview);

            Alert.alert("Tack!", "Din recension har sparats.");
            setModalVisible(false);
            setReviews([newReview, ...reviews]);
        } catch (err) {
            console.error(err);
            Alert.alert("Fel", "Det gick inte att spara recensionen.");
        }
    };

    const handleBooking = async () => {
        try {
            const newBooking = {
                categoryId: id,
                coverImage,
                title,
                bookedAt: new Date().toISOString(),
                status: "in progress",
                name: "Kundens Namn",
                totalAmount: 250,
            };

            const existingData = await AsyncStorage.getItem("bookingList");
            const existingList = existingData ? JSON.parse(existingData) : [];
            const updatedList = [newBooking, ...existingList];

            await AsyncStorage.setItem("bookingList", JSON.stringify(updatedList));
            Alert.alert("Success", "Din bokning har sparats!");
        } catch (error) {
            console.error("Booking error:", error);
            Alert.alert("Fel", "Det gick inte att spara bokningen.");
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            {/* Header with image */}
            <Animated.View
                style={[imageAnimatedStyle]}
                className="relative w-full h-[400px] mb-6 rounded-b-2xl overflow-hidden"
            >
                <Animated.Image
                    style={[imageAnimatedStyle]}
                    source={imageSource}
                    className="w-full h-full"
                    resizeMode="cover"
                />
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

            {/* Body */}
            <ScrollView contentContainerStyle={{paddingBottom: 40}} className="px-4">
                {/* Reviews header */}
                <View className="mt-3 mb-5">
                    <Text className="text-lg font-semibold text-black dark:text-white mb-2 ml-2">
                        Reviews
                    </Text>
                    <StarRatingDisplay rating={4.5} starSize={20} color="#FF9F00"/>
                    <Text className="text-xs text-gray-600 dark:text-gray-300 my-2 ml-2">
                        4.5 out of 5 ({reviews.length} reviews)
                    </Text>
                </View>

                {/* Description */}
                <Text className="font-bold text-black dark:text-white mb-3 text-xl">Description</Text>
                <Animated.Text
                    style={descriptionAnimatedStyle}
                    className="text-base text-gray-700 dark:text-gray-200 leading-6"
                >
                    Här hittar du alla tjänster relaterade till{" "}
                    <Text className="font-semibold text-black dark:text-white">{title}</Text>. {description}
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

                {/* Provider */}
                <View className="h-[1px] bg-neutral-200 dark:bg-neutral-700 mb-3 mt-5"/>
                <TouchableOpacity
                    onPress={() => router.push({
                        //@ts-ignore
                        pathname: `/(provider)/${provider.slug}`,
                        params: {providerId: provider._id}
                    })}
                    className="flex-row items-center p-4"
                >
                    <Image
                        source={{uri: provider.avatar?.asset?.url || "https://avatar.iran.liara.run/public/boy"}}
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <View>
                        <Text className="text-lg font-semibold text-black dark:text-white">{provider.name}</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-300">{provider.role}</Text>
                    </View>
                </TouchableOpacity>

                <View className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-3"/>

                {/* Reviews list */}
                <View className="my-6 px-2">
                    {reviews.map((r, index) => (
                        <ReviewsCard
                            key={index}
                            review={{
                                _id: r._id,
                                name: r.userName || "Användare",
                                avatar: r.avatar || "https://avatar.iran.liara.run/public/boy",
                                date: r.createdAt,
                                rating: r.rating,
                                review: r.comment,
                            }}
                            isLast={index === reviews.length - 1}
                            onDelete={(id) => setReviews(reviews.filter(r => r._id !== id))}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Bottom buttons */}
            <SafeAreaView>
                <View className="flex-row space-x-4 gap-x-6 pb-6 px-4">
                    {/* Leave Review */}
                    <TouchableOpacity
                        onPress={handleLeaveReview}
                        className="bg-blue-600 flex-1 p-3 rounded-full items-center"
                    >
                        <Text className="text-white font-semibold text-lg">Lämna en recension</Text>
                    </TouchableOpacity>

                    <ReviewModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSubmit={(rating, comment) => handleSubmitReview(rating, comment)}
                    />

                    {/* Booking */}
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

export default CategoryDetails;