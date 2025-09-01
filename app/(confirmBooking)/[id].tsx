import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ConfirmBooking() {
    const { id, date, place, startTime, endTime } = useLocalSearchParams<{
        id: string;
        date: string;
        place: string;
        startTime: string;
        endTime: string;
    }>();

    const router = useRouter();

    return (
        <View className="flex-1 bg-white dark:bg-black p-6 justify-center items-center">
            {/* Card container */}
            <View className="w-full max-w-md bg-gray-50 dark:bg-neutral-900 rounded-2xl shadow-lg p-6">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                    Booking Confirmed
                </Text>

                {/* Details */}
                <View className="mt-6 gap-y-3">
                    {/*<View className="flex-row justify-between">*/}
                    {/*    <Text className="text-gray-600 dark:text-gray-400 font-medium">Booking ID:</Text>*/}
                    {/*    <Text className="text-gray-800 dark:text-white font-semibold">{id}</Text>*/}
                    {/*</View>*/}

                    <View className="flex-row justify-between">
                        <Text className="text-gray-600 dark:text-gray-400 font-medium">Date:</Text>
                        <Text className="text-gray-800 dark:text-white font-semibold">{date}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-600 dark:text-gray-400 font-medium">Location:</Text>
                        <Text className="text-gray-800 dark:text-white font-semibold">{place}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-600 dark:text-gray-400 font-medium">Time:</Text>
                        <Text className="text-gray-800 dark:text-white font-semibold">{startTime} - {endTime}</Text>
                    </View>
                </View>

                {/* Button */}
                <TouchableOpacity
                    className="mt-8 bg-yellow-500 rounded-2xl py-3"
                    onPress={() => router.push("/")}
                >
                    <Text className="text-center text-black font-bold text-lg">Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}