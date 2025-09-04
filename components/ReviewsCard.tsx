import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {formatReviewDate} from "@/utils/dateFormatter";
import {Trash2} from 'lucide-react-native';
import {client} from "@/client";
import {useUser} from "@clerk/clerk-expo";
import {useEffect, useState} from "react";

type Review = {
    _id: string;
    name: string;
    avatar?: string;
    date: string;
    rating: number;
    review: string;
    email: string;
};

type ReviewsCardProps = {
    review: Review;
    isLast?: boolean;
    onDelete?: (id: string) => void; // callback to parent
};

export default function ReviewsCard({review, isLast, onDelete}: ReviewsCardProps) {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { user: clerkUser } = useUser();

    useEffect(() => {
        if (!clerkUser) return;

        const email = clerkUser.emailAddresses?.[0]?.emailAddress;
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
    }, [clerkUser?.id]);

    // Check if current user is the author of this review
    const isCurrentUsersReview = currentUser?.email?.toLowerCase() === review.email?.toLowerCase();

    const handleDelete = () => {
        Alert.alert(
            "Ta bort recension",
            "Är du säker på att du vill ta bort denna recension?",
            [
                {text: "Avbryt", style: "cancel"},
                {
                    text: "Ta bort",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await client.delete(review._id);
                            if (onDelete) onDelete(review._id); // notify parent
                            Alert.alert("Borttagen", "Recensionen har tagits bort.");
                        } catch (err) {
                            console.error(err);
                            Alert.alert("Fel", "Det gick inte att ta bort recensionen.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="mb-4">
            <View className="flex-row items-start gap-3 mb-5">
                {/* Avatar */}
                <Image
                    source={{uri: review.avatar || 'https://avatar.iran.liara.run/public/boy'}}
                    className="w-12 h-12 mt-3 mr-1 rounded-full border-2 border-border-gray-800 dark:border-white"
                />

                <View className="flex-1">
                    {/* Header: Name + Date + Delete */}
                    <View className="flex-row justify-between items-center">
                        <View className={'flex flex-col gap-2 mt-3'}>
                            <Text className="text-base font-bold text-black dark:text-white">
                                {review.name}
                            </Text>
                            {/* Review text */}
                            <Text className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                                {review.review}
                            </Text>
                        </View>

                        {/* Rating */}
                        <View className="flex-col items-center mb-5">
                            <StarRatingDisplay
                                rating={review.rating}
                                starSize={14}
                                color="#FF9F00"
                                starStyle={{marginRight: 0}}
                            />
                            <View className="flex-row items-center gap-3 mt-4">
                                <Text className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatReviewDate(review.date)}
                                </Text>
                                {/* Only show delete icon if it's the current user's review */}
                                {isCurrentUsersReview && (
                                    <TouchableOpacity onPress={handleDelete}>
                                        <Trash2 size={16} color={'red'}/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Separator */}
            {!isLast && <View className="h-[1px] bg-gray-300 dark:bg-gray-600 mt-4"/>}
        </View>
    );
}