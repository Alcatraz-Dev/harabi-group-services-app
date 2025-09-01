import {View, Text, TouchableOpacity} from 'react-native';
import {FileText} from "lucide-react-native";
import InvoiceBottomSheet from "@/components/ui/InvoiceBottomSheet";
import React, {useState} from "react";

const BookingSummary = ({ bookingData }: { bookingData: any }) => {
    const {
        title,
        subtotal,
        discount,
        fees,
        totalAmount,
    } = bookingData;
    const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
    return (
        <View className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-5 px-2">
                 Betalningsöversikt
            </Text>

            <View className="mb-6 px-2">
                <Text className="text-sm text-gray-800 dark:text-gray-200">
                     Tjänst: {title || 'Ingen titel'}
                </Text>


            <View className="space-y-1 mt-3">
                <Text className="text-sm text-gray-800 dark:text-gray-200">
                     Delbelopp: {subtotal ? `${subtotal} kr` : 'Ej tillgängligt'}
                </Text>
                <Text className="text-sm text-gray-800 dark:text-gray-200">
                     Rabatt: {discount ? `- ${discount} kr` : '0 kr'}
                </Text>
                <Text className="text-sm text-gray-800 dark:text-gray-200">
                     Avgifter: {fees ? `${fees} kr` : '0 kr'}
                </Text>
                <View className="h-[1px] bg-gray-300 dark:bg-gray-600 my-3" />
                <View className={'flex flex-row justify-between gap-2'}>
                    <Text className="text-base font-semibold text-black dark:text-white mt-2">
                        Totalt att betala: {totalAmount ? `${totalAmount} kr` : 'Ej tillgängligt'}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setInvoiceModalVisible(true)}
                        className="  p-3 bg-indigo-600 rounded-xl items-center"
                    >
                        <View className={'flex flex-row items-center gap-2'}>
                            <FileText color="white" size={15} />
                            <Text className="text-white font-semibold text-xs ">Visa faktura</Text>
                        </View>

                    </TouchableOpacity>

                    <InvoiceBottomSheet
                        visible={invoiceModalVisible}
                        onClose={() => setInvoiceModalVisible(false)}
                        bookingData={bookingData}
                    />
                </View>

            </View>
            </View>
        </View>
    );
};

export default BookingSummary;