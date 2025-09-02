import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { formatReviewDate } from "@/utils/dateFormatter";
import { Trash2 } from 'lucide-react-native';
import { client } from "@/client";

type Review = {
    _id: string;
    name: string;
    avatar?: string;
    date: string;
    rating: number;
    review: string;
};

type ReviewsCardProps = {
    review: Review;
    isLast?: boolean;
    onDelete?: (id: string) => void; // callback to parent
};

export default function ReviewsCard({ review, isLast, onDelete }: ReviewsCardProps) {
    const handleDelete = () => {
        Alert.alert(
            "Ta bort recension",
            "Är du säker på att du vill ta bort denna recension?",
            [
                { text: "Avbryt", style: "cancel" },
                { text: "Ta bort", style: "destructive", onPress: async () => {
                        try {
                            await client.delete(review._id);
                            if (onDelete) onDelete(review._id); // notify parent
                            Alert.alert("Borttagen", "Recensionen har tagits bort.");
                        } catch (err) {
                            console.error(err);
                            Alert.alert("Fel", "Det gick inte att ta bort recensionen.");
                        }
                    }}
            ]
        );
    };

    return (
        <View className="mb-4">
            <View className="flex-row items-start gap-3">
                {/* Avatar */}
                <Image
                    source={{ uri: review.avatar || 'https://avatar.iran.liara.run/public/boy' }}
                    className="w-10 h-10 rounded-full mt-1.5"
                />

                <View className="flex-1">
                    {/* Header: Name + Date + Delete */}
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-bold text-black dark:text-white">
                            {review.name}
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                {formatReviewDate(review.date)}
                            </Text>
                            <TouchableOpacity onPress={handleDelete}>
                                <Trash2 size={16} color={'red'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Rating */}
                    <StarRatingDisplay
                        rating={review.rating}
                        starSize={14}
                        color="#FF9F00"
                        starStyle={{ marginRight: 0 }}
                    />

                    {/* Review text */}
                    <Text className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {review.review}
                    </Text>
                </View>
            </View>

            {/* Separator */}
            {!isLast && <View className="h-[1px] bg-gray-300 dark:bg-gray-600 mt-4" />}
        </View>
    );
}