import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import {useState} from 'react';
import {ArrowLeftCircle} from "lucide-react-native";
import {useRouter} from "expo-router";
import {useAppTheme} from "@/hooks/useTheme";

export default function ReferralCodeScreen() {
    const {theme: colorScheme} = useAppTheme();
    const router = useRouter();
    const [referralCode, setReferralCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);

        // هنا يمكن إضافة تحقق من صحة كود الإحالة مع السيرفر أو فقط قبول القيمة
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('Tack!', referralCode ? `Kod mottagen: ${referralCode}` : 'Ingen kod angiven');
            // التنقل للصفحة الرئيسية أو الشاشة التي تريدها بعد إدخال الكود
            router.replace('/(tabs)/home');
        }, 1000);
    };

    const handleSkip = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900 px-6">
            <View className=" flex flex-row justify-between py-4">
                <ArrowLeftCircle size={30} color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                                 onPress={() => router.back()}/>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-center">
                <View>
                    <Text className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white">
                        Ange din referenskod
                    </Text>
                    <TextInput
                        placeholder="Referral Code (valfritt)"
                        value={referralCode}
                        onChangeText={setReferralCode}
                        className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-5 py-4 text-base text-gray-800 dark:text-white mb-8"
                        placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    />

                    <TouchableOpacity onPress={handleSubmit} disabled={isLoading}>
                        <View
                            className={`bg-gray-800 dark:bg-gray-200 py-4 rounded-full ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                            <Text
                                className={`text-white dark:text-gray-800 font-bold text-lg text-center`}>
                                Skicka
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSkip} className="mt-6">
                        <Text className="text-center text-gray-500 dark:text-gray-400 underline">
                            Hoppa över
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}