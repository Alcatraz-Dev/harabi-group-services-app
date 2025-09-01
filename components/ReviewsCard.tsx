import { FlatList, View, Text, Image } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import {reviews} from "@/constants/reviewsData";
import {formatReviewDate} from "@/utils/dateFormatter"; // تأكد من استيرادك الصحيح


export default function ReviewsCard() {
    return (
        <View className={''}>
            <Text className="font-bold text-black dark:text-white mb-3 text-xl">Reviews</Text>

            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                    <View className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-3" />
                )}
                renderItem={({ item }) => (
                    <View className="flex-row items-start space-x-4 mb-1 gap-3">
                        <Image
                            source={{ uri: item.avatar }}
                            className="w-10 h-10 rounded-full mt-1.5"
                            accessibilityLabel={`${item.name} avatar`}
                        />
                        <View className="flex-1 space-y-1">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-base font-bold text-black dark:text-white mx-1">{item.name}</Text>
                                <Text className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatReviewDate(item.date)}
                                </Text>
                            </View>
                            <StarRatingDisplay
                                rating={item.rating}
                                starSize={10}
                                color="#FF9F00"
                                starStyle={{ marginRight: 0 }}


                            />
                            <Text className="text-sm text-gray-700 dark:text-gray-300 pt-2">{item.review}</Text>
                        </View>
                    </View>
                )}
                scrollEnabled={false} // اجعلها true لو حبيت تكون قابلة للتمرير فقط للمراجعات
            />
        </View>
    );
}