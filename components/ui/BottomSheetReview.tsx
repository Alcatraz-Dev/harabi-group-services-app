import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { X } from 'lucide-react-native';
import StarRating from "react-native-star-rating-widget";
import { BlurView } from 'expo-blur';

type ReviewModalProps = {
    visible: boolean;
    onClose: () => void;
};

const ReviewModal = ({ visible, onClose }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const handleSubmit = () => {
        if (rating === 0 || reviewText.trim() === '') {
            Alert.alert('Fel', 'Vänligen fyll i både betyg och recension.');
            return;
        }

        // هنا يمكنك حفظ البيانات في Sanity أو مكان آخر لاحقًا
        Alert.alert('Tack !', 'Tack för din recension!');
        onClose();
        setRating(0);
        setReviewText('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <BlurView
                intensity={80}
                tint="dark"
                className="flex-1 justify-center items-center px-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
                <View className="bg-white dark:bg-neutral-800 p-6 rounded-2xl w-full relative max-w-md">
                    {/* إغلاق */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute right-4 top-4 z-50"
                    >
                        <X size={24} color="#666" />
                    </TouchableOpacity>

                    <Text className="text-lg font-bold mb-3 text-black dark:text-white">
                        Lämna en recension
                    </Text>

                    <StarRating
                        rating={rating}
                        onChange={setRating}
                        starSize={30}
                        color="#FF9F00"
                    />

                    <TextInput
                        multiline
                        numberOfLines={4}
                        value={reviewText}
                        onChangeText={setReviewText}
                        placeholder="Skriv din recension här..."
                        className="border rounded-xl p-3 mt-4 text-black dark:text-white bg-white dark:bg-neutral-700"
                        placeholderTextColor="#888"
                    />

                    <TouchableOpacity
                        className={`mt-4 py-3 rounded-xl ${
                            rating > 0 && reviewText.trim()
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                        }`}
                        onPress={handleSubmit}
                        disabled={rating === 0 || reviewText.trim() === ''}
                    >
                        <Text className="text-white text-center font-semibold">
                            Skicka
                        </Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
};

export default ReviewModal;