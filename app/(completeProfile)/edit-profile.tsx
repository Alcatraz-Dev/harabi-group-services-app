import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
    Modal,
    ActivityIndicator
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useUser} from '@clerk/clerk-expo';
import {SafeAreaView} from "react-native-safe-area-context";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ArrowLeftCircle} from "lucide-react-native";
import {useRouter} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {useAppTheme} from "@/hooks/useTheme";
import {cities} from "@/constants/cities";
import {client} from "@/client";
import CustomInput from "@/components/ui/CustomInput";

type SelectFieldProps = {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onSelect: (val: string) => void;
};

const SelectField = ({label, value, options, onSelect}: SelectFieldProps) => {
    const {theme: colorScheme, setTheme} = useAppTheme();
    const [visible, setVisible] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label;

    return (
        <View className="mb-5">
            <Text className="text-gray-800 dark:text-gray-200 font-medium mb-2 text-base">
                {label}
            </Text>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
                className="bg-neutral-100 dark:bg-neutral-800  px-5 py-4 rounded-xl "
            >
                <Text className="text-gray-800 dark:text-white">{selectedLabel}</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <View className="bg-neutral-100 dark:bg-neutral-800  p-6 rounded-2xl w-full max-w-sm shadow-lg">
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => {
                                    onSelect(opt.value);
                                    setVisible(false);
                                }}
                                activeOpacity={0.7}
                                className="py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                                <Text className="text-gray-800 dark:text-white text-base">
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            className="mt-4 pt-3"
                            activeOpacity={0.7}
                        >
                            <Text className="text-blue-600 dark:text-blue-400 text-center font-medium">
                                Avbryt
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default function EditProfile() {
    const {user} = useUser();
    const {theme: colorScheme, setTheme} = useAppTheme();
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userNme, setUserNme] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const toggleTheme = () => {
        setTheme(colorScheme === 'dark' ? 'light' : 'dark');
    };


    const getUserReferralCode = async () => {
        if (user) {
            const userReferralCode = await client.fetch(
                `*[_type == "user" && clerkId == $clerkId][0]`,
                {clerkId: user.id}
            );
            setReferralCode(userReferralCode || '');
        }
    };
    useEffect(() => {
        if (user) {
            setFirstName(user?.unsafeMetadata?.firstName as string || '');
            setLastName(user?.unsafeMetadata?.lastName as string || '');
            setLocation((user?.unsafeMetadata?.location as string) || '');
            setLanguage((user?.unsafeMetadata?.language as string) || 'sv');
            setPhoneNumber((user?.unsafeMetadata?.phoneNumber as string) || '');
            setUserNme((user?.unsafeMetadata?.userName as string) || '');
            setReferralCode((user?.unsafeMetadata?.referralCode as string) || '');
            setTheme((user?.unsafeMetadata?.theme as 'light' | 'dark' | 'system') || 'system');
            setImage(user?.imageUrl || 'https://i.pravatar.cc/150?img=3');
        }
    }, [user]);

    const pickImage = async () => {
        try {
            // 1. Request permissions
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your photos');
                return;
            }

            // 2. Launch image picker with correct mediaTypes format
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct property name
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };
    const uploadImage = async (uri: string) => {
        try {
            // 1. Verify file exists
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            // 2. Determine MIME type from extension
            const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg';
            const mimeType = `image/${fileExtension === 'png' ? 'png' :
                fileExtension === 'gif' ? 'gif' : 'jpeg'}`;

            // 3. Create file object in format Clerk expects
            return {
                uri,
                name: `profile.${fileExtension}`,
                type: mimeType,
            };
        } catch (error) {
            console.error('File processing error:', error);
            throw error;
        }
    };


    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim() || !location.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'Could not fetch user information');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Update profile image if changed
            if (image && image !== user.imageUrl) {
                const file = await uploadImage(image);
                // @ts-ignore
                await user.setProfileImage({file});
                await user.update({
                    unsafeMetadata: {
                        avatarUrl: image,
                    }
                });
            }


            const cityName = cities.find((c) => c.id === location)?.name || location;
            const userReferralCode = await client.fetch(
                `*[_type == "user" && clerkId == $clerkId][0]`,
                {clerkId: user.id}
            );

            const updatedMetadata = {
                fullName: `${firstName.trim()} ${lastName.trim()}`,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                userName: userNme.trim(),
                email: user.emailAddresses[0]?.emailAddress || '',
                avatarUrl: user.imageUrl,
                points: 0,
                referralCode: userReferralCode?.referralCode || '',
                phoneNumber: phoneNumber.trim(),
                location: cityName,
                language: user.unsafeMetadata?.language || 'sv',
            };

            await user.update({unsafeMetadata: updatedMetadata});
            await handelUserUpdateInSanity(updatedMetadata);
            Alert.alert('Saved !', 'Your profile has been saved');
            router.back();
        } catch (error: any) {
            console.error('Update error:', error);
            Alert.alert('Error', error?.errors?.[0]?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handelUserUpdateInSanity = async (metadata: any) => {
        try {
            const sanityUser = await client.fetch(
                `*[_type == "user" && clerkId == $userId][0]{_id}`,
                {userId: user?.id}
            );

            if (sanityUser?._id) {
                await client.patch(sanityUser._id).set(metadata).commit();
            }
        } catch (error: any) {
            console.error('Sanity update error:', error);
            Alert.alert('Fel!', error?.message || 'Det gick inte att uppdatera profilen i Sanity.');
        }
    };
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-800 ">
                <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#60a5fa' : '#2563eb'}/>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900 ">
            {/* Header */}

            <View className=" flex flex-row justify-between px-5">
                <ArrowLeftCircle size={25} color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                                 onPress={() => router.push('/(tabs)/profile')}/>

            </View>
            <View className="flex-row items-center justify-center ">
                <Text className="text-gray-800 dark:text-white text-2xl font-extrabold"> Redigera profil</Text>
            </View>

            <ScrollView contentContainerStyle={{paddingHorizontal: 24, paddingVertical: 16}}>
                {/* Profile Picture */}
                <View className="items-center my-8">
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{uri: image || 'https://i.pravatar.cc/150?img=3'}}
                            className="w-32 h-32 rounded-full border-4 border-border-gray-800 dark:border-white"
                        />
                        <View
                            className="absolute -bottom-2 -right-0 bg-gray-800 dark:bg-white p-3 rounded-full border-2 border-white dark:border-gray-800">
                            <MaterialCommunityIcons name="camera" size={12}
                                                    color={colorScheme === 'dark' ? '#171717' : '#ffffff'}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className={'mt-10'}>
                    {/* First Name */}

                    <CustomInput label="Förnamn" iconName="account" Value={firstName} OnChangeText={setFirstName}/>

                    {/* Last Name */}

                    <CustomInput label={'Efternamn'} iconName={"account-outline"} Value={lastName}
                                 OnChangeText={setLastName}/>
                    {/* User Name */}

                    {/*</View>*/}
                    <CustomInput label={'Användarnamn'} iconName={"account-outline"} Value={userNme}
                                 OnChangeText={setUserNme}/>
                    {/*Phone Number*/}

                    <CustomInput label={'Telefonnummer'} iconName={'phone'} Value={phoneNumber}
                                 OnChangeText={setPhoneNumber}/>

                    {/* Location */}
                    <CustomInput label={'Stad / Land'} iconName={'map-marker'} Value={location} OnChangeText={setLocation}/>

                    {/* Language Selector */}
                    <SelectField
                        label="Språk"
                        value={language}
                        onSelect={setLanguage}
                        options={[
                            {label: "🇸🇪 Svenska", value: "sv"},
                            {label: "🇬🇧 English", value: "en"},
                            {label: "🇸🇦 العربية", value: "ar"},
                            {label: "🇫🇷 Français", value: "fr"},
                        ]}
                    />

                    {/* Theme Selector */}
                    <SelectField
                        label="Tema"
                        // @ts-ignore
                        value={colorScheme}
                        onSelect={(val) => setTheme(val as 'light' | 'dark' | 'system')}
                        options={[
                            {label: "Systemets standard", value: "system"},
                            {label: "Ljust läge", value: "light"},
                            {label: "Mörkt läge", value: "dark"},
                        ]}
                    />

                    <TouchableOpacity onPress={handleSave}>
                        <View className="flex-row items-center justify-center mt-10">
                            <View className="flex-1 bg-gray-800 dark:bg-gray-200 py-4 rounded-full">
                                <Text className="text-white dark:text-gray-800 font-bold text-lg text-center">
                                    Spara
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}