import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/hooks/useTheme';

type Props = {
    visible: boolean;
    onClose: () => void;
    bookingData: any;
};

const InvoiceBottomSheet = ({ visible, onClose, bookingData }: Props) => {
    const { theme: colorScheme } = useAppTheme();
    if (!bookingData) return null;

    const isDark = colorScheme === 'dark';
    const blurTint = isDark ? 'dark' : 'light';

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end">
                {/* Overlay background with blur and theme-aware tint */}
                <BlurView intensity={50} tint={blurTint} className="absolute inset-0" />

                {/* Tap outside to close */}
                <Pressable className="flex-1" onPress={onClose} />

                {/* Invoice container */}
                <View className="bg-white dark:bg-neutral-900 p-6 rounded-t-2xl max-h-[80%] shadow-xl">
                    <Text className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
                        Faktura
                    </Text>

                    {/* Invoice Number */}
                    <View className="mb-4 space-y-1">
                        <Text className="text-base font-semibold text-black dark:text-white">
                            Fakturanummer:
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            {bookingData.invoiceNumber || 'Ej tillgänglig'}
                        </Text>
                    </View>

                    {/* Invoice Date */}
                    <View className="mb-4 space-y-1">
                        <Text className="text-base font-semibold text-black dark:text-white">
                            Datum:
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            {bookingData.invoiceDate || 'Ej tillgänglig'}
                        </Text>
                    </View>

                    {/* Customer Info */}
                    <View className="mb-4 space-y-1">
                        <Text className="text-base font-semibold text-black dark:text-white">
                            Kund:
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            {bookingData.customer?.name}
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            {bookingData.customer?.email}
                        </Text>
                    </View>

                    {/* Amounts */}
                    <View className="my-4 border-t border-gray-300 dark:border-gray-700 pt-4 space-y-1">
                        <Text className="text-base font-semibold text-black dark:text-white">
                            Belopp:
                        </Text>
                        <Text className="text-gray-800 dark:text-gray-200">
                            Subtotal: {bookingData.subtotal} kr
                        </Text>
                        <Text className="text-gray-800 dark:text-gray-200">
                            Rabatt: {bookingData.discount} kr
                        </Text>
                        <Text className="text-gray-800 dark:text-gray-200">
                            Avgifter: {bookingData.fees} kr
                        </Text>
                        <Text className="font-bold text-lg text-black dark:text-white mt-2">
                            Totalt: {bookingData.totalAmount} kr
                        </Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-6 bg-blue-600 p-3 rounded-xl items-center mb-5"
                    >
                        <Text className="text-white font-semibold">Stäng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InvoiceBottomSheet;