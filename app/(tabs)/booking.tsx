import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftCircle, ChevronRight} from 'lucide-react-native';
import {useAppTheme} from '@/hooks/useTheme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from "expo-router";


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

const Booking = () => {
    const navigation = useNavigation();
    const [bookingList, setBookingList] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const {theme: colorScheme} = useAppTheme();

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('bookingList');
                if (jsonValue != null) {
                    const parsedList = JSON.parse(jsonValue);
                    setBookingList(Array.isArray(parsedList) ? parsedList : []);
                }
            } catch (e) {
                console.error('Error reading booking list', e);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, []);


    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-600 ';
            case 'pending':
                return 'bg-orange-500 ';
            case 'in progress':
                return 'bg-blue-500 ';
            case 'completed':
                return 'bg-gray-500 ';
            case 'cancelled':
                return 'bg-red-600 ';
            default:
                return 'bg-gray-400 ';
        }
    };
    const handleDelete = async (indexToDelete: number) => {
        Alert.alert(
            'Radera bokning',
            'Är du säker på att du vill radera denna bokning?',
            [
                {text: 'Avbryt', style: 'cancel'},
                {
                    text: 'Radera',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedList = bookingList.filter((_, index) => index !== indexToDelete);
                        setBookingList(updatedList);
                        await AsyncStorage.setItem('bookingList', JSON.stringify(updatedList));
                    },
                },
            ]
        );
        console.log('Radera bokning:', indexToDelete);
    };
    const renderItem = ({item, index}: { item: BookingData, index: number }) => (
        <View
            className="bg-neutral-100 dark:bg-neutral-900 p-6 mb-4 rounded-2xl shadow-sm border border-neutral-300 dark:border-neutral-700 ">
            <View className={'flex-row justify-between my-1'}>
                {/* Status */}
                <View className={`self-start px-3 py-2 rounded-full mb-3 ${statusColor(item.status)}`}>
                    <Text className="font-semibold text-sm uppercase text-white ">
                        {item.status ?? 'Okänd status'}
                    </Text>
                </View>
                {/* Delete button */}
                <TouchableOpacity
                    onPress={() => handleDelete(index)}
                >
                    <Icon name="trash-outline" size={16} color={colorScheme === 'dark' ? '#fff' : '#000'}/>
                </TouchableOpacity>
            </View>


            <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {item.title}
            </Text>
            <View className="flex flex-row items-center justify-between">

                <Text className="text-lg text-neutral-800 dark:text-neutral-200 mb-1 font-medium">
                    Namn: {item.name ?? 'Ej angivet'}
                </Text>
                <TouchableOpacity onPress={() =>
                    router.push({
                        // @ts-ignore
                        pathname: `/(bookingDetails)/${item.categoryId}`,
                        params: {
                            booking: JSON.stringify(item),
                        },
                    })

                } className={'mb-8'}
                >
                    <ChevronRight size={24} color={colorScheme === 'dark' ? '#fff' : '#000'}/>
                </TouchableOpacity>


            </View>
            <Text className="text-sm text-neutral-700 dark:text-neutral-400 mb-4">
                Datum: {formatDate(item.bookedAt)}
            </Text>

            <View
                className="flex-row items-center justify-between border-t border-neutral-300 dark:border-neutral-700 pt-5  gap-5">
                <View className="flex-row items-center gap-2">
                    <Icon name="checkmark-circle" size={24} color='#2492ff'/>
                    <Text className="text-neutral-900 dark:text-neutral-100 font-semibold text-lg">
                        {item.totalAmount ? `${item.totalAmount} SEK` : 'Belopp ej tillgängligt'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => console.log('Book Again pressed')}
                    className="bg-neutral-900 dark:bg-neutral-100 rounded-lg px-3 py-2 justify-center items-center"
                >
                    <Text className="text-neutral-100 dark:text-neutral-900 font-semibold text-sm">
                        Boka igen
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-neutral-100 dark:bg-neutral-900">
                <ActivityIndicator size="large" color="#4b5563"/>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900 ">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                    <ArrowLeftCircle size={25} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>
                </TouchableOpacity>
                <Text className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    Din Bokning
                </Text>
                <View style={{width: 28}}/>
            </View>

            {bookingList.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-neutral-700 dark:text-neutral-300 text-center text-lg font-medium">
                        Du har inga bokningar för tillfället.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={bookingList}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{paddingBottom: 70 , paddingHorizontal: 20 , paddingTop: 10}}
                />
            )}
        </SafeAreaView>
    );
};

export default Booking;