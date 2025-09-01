import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity, FlatList, Linking, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ArrowLeftCircle, FileText, MessageCircle, PenLine, Phone, RefreshCcw} from 'lucide-react-native';
import {router, useLocalSearchParams} from 'expo-router';
import BookingTimeline from "@/components/BookingTimeline";
import BookingSummary from "@/components/BookingSummary";
import ReviewModal from "@/components/ui/BottomSheetReview";
import InvoiceBottomSheet from "@/components/ui/InvoiceBottomSheet";


type BookingData = {
    categoryId?: string;
    title?: string;
    coverImage?: string;
    description?: string;
    phone?: string;
    bookedAt?: string;
    status?: string;
    name?: string;
    subtotal?: number;
    discount?: number;
    fees?: number;
    totalAmount?: number;

    // ✅ New fields for invoice
    invoiceDate?: string;
    invoiceNumber?: string;
    customer?: {
        name: string;
        email: string;
        address?: string;
        phone?: string;
    };
};

const statuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];


const BookingById = () => {

    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const { booking } = useLocalSearchParams();

    const bookingData: BookingData | null = booking ? JSON.parse(booking as string) : null;

    if (!bookingData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-neutral-700">Ingen bokningsdata tillgänglig.</Text>
            </View>
        );
    }
    useEffect(() => {
        const loadBookingData = async () => {
            try {
                const jsonData = await AsyncStorage.getItem('bookingList');
                if (jsonData) {
                    const data = JSON.parse(jsonData);
                    return data

                }
            } catch (error) {
                console.error('Failed to load booking data', error);
            } finally {
                setLoading(false);
            }
        };

        loadBookingData();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-neutral-900 px-4">
                <ActivityIndicator size="large" color="#4F46E5"/>
                <Text className="mt-4 text-gray-700 dark:text-gray-300 text-base">
                    Laddar bokningsinformation...
                </Text>
            </View>
        );
    }

    if (!bookingData) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-neutral-900 px-4">
                <Text className="text-gray-500 dark:text-gray-400 text-lg">Ingen bokningsdata tillgänglig.</Text>
            </View>
        );
    }

    const handleCall = () => {
        Linking.openURL('tel:+46701234567');
    };

    const handleChat = () => {
        const phoneNumber = '+46701234567'; // رقم الهاتف الدولي
        const message = encodeURIComponent("Hej! Jag är intresserad av er tjänst och vill gärna få mer information.");
        const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Fel', 'Det gick inte att öppna WhatsApp.');
        });
    };
    // BottomSheet & Review

    const handleLeaveReview = () => {
        setModalVisible(true);
    };
    const handleBookingAgain = async (bookingData: BookingData) => {
        try {
            if (!bookingData) {
                Alert.alert('Fel', 'Ingen tidigare bokningsdata hittades.');
                return;
            }

            const newBooking = {
                ...bookingData,
                bookedAt: new Date().toISOString(),
                status: 'pending',
            };

            const existingData = await AsyncStorage.getItem('bookingList');
            const existingList = existingData ? JSON.parse(existingData) : [];

            const updatedList = [newBooking, ...existingList];

            await AsyncStorage.setItem('bookingList', JSON.stringify(updatedList));

            // الانتقال إلى صفحة الحجز أو إظهار رسالة نجاح
            Alert.alert('Lyckat', 'Bokningen har lagts till igen!');
            router.push('/(tabs)/booking');
        } catch (error) {
            console.error('Booking again error:', error);
            Alert.alert('Fel', 'Det gick inte att boka igen.');
        }
    };
    return (
        <View className="bg-white dark:bg-neutral-900 flex-1">
            <View className="relative w-full h-[300px] mb-6 rounded-b-2xl overflow-hidden ">
                {bookingData.coverImage ? (
                    <Image
                        source={{uri: bookingData.coverImage}}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : null}
                <TouchableOpacity
                    onPress={() => {
                        router.push('/(tabs)/booking');
                    }}
                    className="absolute top-16 left-4 z-10"
                    accessibilityLabel="Go back"
                >
                    <ArrowLeftCircle size={30} color="white"/>
                </TouchableOpacity>
                <View className="flex-1 justify-end items-center pb-6 absolute bottom-0 left-0 right-0">
                    <Text className="text-white text-xl font-extrabold text-center px-4">

                        Boknings Detaljer - {bookingData.title || 'Ingen titel'}
                    </Text>
                </View>
            </View>

            <FlatList
                data={[]}
                ListHeaderComponent={
                    <View className="px-4">
                        <View className="flex-row gap-4 pb-6 px-4 items-center mt-3">
                            {/* زر ترك مراجعة */}
                            <TouchableOpacity
                                onPress={handleLeaveReview}
                                className=" flex-1  p-3 bg-blue-600 rounded-xl items-center gap-2"
                            >
                                <View className={'flex flex-row items-center gap-2'}>
                                <PenLine color="white" size={18} />
                                <Text className="text-white font-semibold text-sm">Lämna en recension</Text>
                                </View>
                            </TouchableOpacity>

                            <ReviewModal
                                visible={modalVisible}
                                onClose={() => setModalVisible(false)}
                            />

                            {/* زر الحجز مجددًا */}
                            <TouchableOpacity
                                onPress={() => handleBookingAgain(bookingData)}
                                className=" flex-1  p-3 bg-green-600 rounded-xl items-center gap-2"
                            >
                                <View className={'flex flex-row items-center gap-2'}>
                                <RefreshCcw color="white" size={18} />
                                <Text className="text-white font-semibold text-sm">Boka igen</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 rounded-xl">
                            {/* Provider Info */}
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: 'https://avatar.iran.liara.run/public/boy' }}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <View>
                                    <Text className="text-lg font-semibold text-black dark:text-white">John Doe</Text>
                                    <Text className="text-sm text-gray-600 dark:text-gray-300">Provider</Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View className="flex-row items-center justify-center gap-4 ">
                                <TouchableOpacity
                                    onPress={handleCall}
                                    className="flex-col items-center bg-neutral-100 dark:bg-neutral-800 px-6 py-3 rounded-xl "
                                >
                                    <Phone size={18} color="#1E90FF" />
                                    <Text className="text-xs text-blue-600 mt-1">Call</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleChat}
                                    className="flex-col items-center bg-neutral-100 dark:bg-neutral-800 px-6 py-3 rounded-xl"
                                >
                                    <MessageCircle size={18} color="#32CD32" />
                                    <Text className="text-xs text-green-600 mt-1">Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Separator */}
                        <View className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-3" />

                        <Text className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">
                            Boknings Status
                        </Text>

                        {/* Status Timeline */}
                        <BookingTimeline statuses={statuses} currentStatus={bookingData.status}/>


                    </View>
                }
                keyExtractor={(_, index) => index.toString()}
                renderItem={null}
                ListEmptyComponent={null}
                showsVerticalScrollIndicator={false}
            />
            {/* Summary */}
            <BookingSummary bookingData={bookingData} />
        </View>
    );
};

export default BookingById;