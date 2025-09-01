import { View, Text, Image, TouchableOpacity } from 'react-native';

type ServiceCardProps = {
    title: string;
    image: string;
    price: string;
    rating: number;
    onPress?: () => void;
};

export default function ServiceCard({
                                        title,
                                        image,
                                        price,
                                        rating,
                                        onPress,
                                    }: ServiceCardProps) {
    return (
        <TouchableOpacity
            className="bg-neutral-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm  mb-4 overflow-hidden"
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Image source={{ uri: image }} className="w-full h-40" resizeMode="cover" />

            <View className="p-4">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">{title}</Text>
                <Text className="text-sm text-zinc-500 dark:text-zinc-300 mb-2">{price} SEK</Text>
                <Text className="text-sm text-yellow-500">★ {rating.toFixed(1)} / 5</Text>
            </View>
        </TouchableOpacity>
    );
}