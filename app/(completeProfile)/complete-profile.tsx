import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView, ImageBackground,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {useUser} from '@clerk/clerk-expo';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LanguageSelector from '@/components/LanguageSelector';
import {cities} from '@/constants/cities';
import {languages} from '@/constants/languages';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppTheme} from '@/hooks/useTheme';
import {client} from "@/client";
import {BlurView} from "expo-blur";

export default function CompleteProfile() {
    const router = useRouter();
    const {user} = useUser();
    const {theme, setTheme} = useAppTheme();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userNme, setUserNme] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState(cities[0].id);
    const [language, setLanguage] = useState(languages[0].code);
    const [referralCode, setReferralCode] = useState('');
    const handleSubmit = async () => {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !userNme.trim() ||
            !phoneNumber.trim() ||
            !location.trim() ||
            !language.trim()
        ) {
            Alert.alert('Fel!', 'Vänligen fyll i alla fält.');
            return;
        }

        if (!user) {
            Alert.alert('Fel!', 'Användarinformation kunde inte hämtas.');
            return;
        }

        try {
            const cityName = cities.find((c) => c.id === location)?.name || location;
            const languageCode = languages.find((l) => l.code === language)?.code || language;

            const currentUserSanity = await client.fetch(
                `*[_type == "user" && clerkId == $clerkId][0]`,
                { clerkId: user.id }
            );

            let points = 0;
            let referredByUserId = null;

            // Check referral code
            if (referralCode.trim()) {
                const referrer = await client.fetch(
                    `*[_type == "user" && referralCode == $referralCode][0]`,
                    { referralCode: referralCode.trim() }
                );

                if (referrer) {
                    points = 50; // reward user using the code
                    referredByUserId = referrer._id;

                    // (Optional) give points to referrer too
                    await client
                        .patch(referrer._id)
                        .setIfMissing({ points: 0 })
                        .inc({ points: 50 })
                        .commit();
                } else {
                    Alert.alert('Fel!', 'Ogiltig referenskod.');
                    return;
                }
            }

            const updatedMetadata = {
                fullName: `${firstName.trim()} ${lastName.trim()}`,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                userName: userNme.trim(),
                email: user.emailAddresses[0]?.emailAddress || '',
                avatarUrl: user.imageUrl,
                points,
                referralCode: currentUserSanity?.referralCode || '', // your user's own referral code
                referredBy: referredByUserId,
                phoneNumber: phoneNumber.trim(),
                location: cityName,
                language: languageCode
            };

            await user.update({ unsafeMetadata: updatedMetadata });
            await handelUserUpdateInSanity(updatedMetadata);
            await AsyncStorage.setItem('completeProfile', 'true');
            router.replace('/(tabs)/home');
        } catch (error: any) {
            console.error('Update error:', error);
            Alert.alert('Fel!', error?.errors?.[0]?.message || 'Det gick inte att uppdatera profilen.');
        }
    };

    const handelUserUpdateInSanity = async (metadata: any) => {
        try {
            const sanityUser = await client.fetch(
                `*[_type == "user" && clerkId == $userId][0]{_id}`,
                { userId: user?.id }
            );

            if (sanityUser?._id) {
                const updateData: any = { ...metadata };

                if (metadata.referredBy) {
                    updateData.referredBy = {
                        _type: 'reference',
                        _ref: metadata.referredBy
                    };
                }

                await client.patch(sanityUser._id).set(updateData).commit();
            }
        } catch (error: any) {
            console.error('Sanity update error:', error);
            Alert.alert('Fel!', error?.message || 'Det gick inte att uppdatera profilen i Sanity.');
        }
    };

    return (
        <ImageBackground
            source={{uri: 'https://images.unsplash.com/photo-1579359565489-8e65439e6d1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
            resizeMode="cover"
            className="flex-1"
        >
            {/* طبقة الضباب */}
            <BlurView intensity={80} tint="dark" className="flex-1 px-4 justify-center">
                <SafeAreaView className={'flex-1 '}>


                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="flex-1"
                    >
                        <ScrollView
                            contentContainerStyle={{padding: 10, flexGrow: 1, marginTop: 50}}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text className="text-3xl font-bold text-center mb-8 text-black dark:text-white">
                                Slutför din profil
                            </Text>

                            <View className="p-2">
                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Förnamn
                                </Text>
                                <TextInput
                                    placeholder="Skriv ditt förnamn"
                                    value={firstName}
                                    onChangeText={setFirstName}

                                    className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white  placeholder:text-gray-400"
                                    placeholderTextColor="#888"
                                />

                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Efternamn
                                </Text>
                                <TextInput
                                    placeholder="Skriv ditt efternamn"
                                    value={lastName}
                                    onChangeText={setLastName}

                                    className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white placeholder:text-gray-400"
                                    placeholderTextColor="#888"
                                />
                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Användarnamn
                                </Text>
                                <TextInput
                                    placeholder="Skriv ditt efternamn"
                                    value={userNme}
                                    onChangeText={setUserNme}

                                    className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white  placeholder:text-gray-400"
                                    placeholderTextColor="#888"
                                />

                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Telefonnummer
                                </Text>
                                <TextInput
                                    placeholder="Skriv ditt telefonnummer"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"

                                    className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white  placeholder:text-gray-400"
                                    placeholderTextColor="#888"
                                />
                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Referral Code (optional)
                                </Text>
                                <TextInput
                                    placeholder="Enter referral code if you have one"
                                    value={referralCode}
                                    onChangeText={setReferralCode}

                                    className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white  placeholder:text-gray-400"
                                    placeholderTextColor="#888"
                                />

                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Stad / Land
                                </Text>
                                <View className="rounded-lg mb-4">
                                    <Picker selectedValue={location} onValueChange={setLocation}>
                                        <Picker.Item label="🇸🇪 Sverige" value="" enabled={false}/>
                                        {cities
                                            .filter((city) => city.country === 'Sweden')
                                            .map((city) => (
                                                <Picker.Item key={city.id} label={city.name} value={city.id}/>
                                            ))}

                                        <Picker.Item label="🇹🇳 Tunisien" value="" enabled={false}/>
                                        {cities
                                            .filter((city) => city.country === 'Tunisia')
                                            .map((city) => (
                                                <Picker.Item key={city.id} label={city.name} value={city.id}/>
                                            ))}
                                    </Picker>
                                </View>

                                <Text className="text-lg font-medium mb-2 text-black dark:text-white">
                                    Välj språk
                                </Text>
                                <LanguageSelector
                                    selected={language}
                                    onSelect={setLanguage}
                                    languages={languages.map((lang) => ({
                                        id: lang.id,
                                        code: lang.code,
                                        label: lang.name,
                                        icon: lang.icon,
                                    }))}
                                />

                                <Text className="text-lg font-medium mt-4 mb-2 text-black dark:text-white">
                                    Tema
                                </Text>
                                <View className="mb-6">
                                    <Picker selectedValue={theme} onValueChange={setTheme}>
                                        <Picker.Item label="Systemets standard" value="system"/>
                                        <Picker.Item label="Ljust läge" value="light"/>
                                        <Picker.Item label="Mörkt läge" value="dark"/>
                                    </Picker>
                                </View>

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="flex-1 bg-gray-800 dark:bg-gray-200 py-4 rounded-full active:opacity-80"
                                >
                                    <Text className="text-white dark:text-gray-800 font-bold text-lg text-center">
                                        Spara och fortsätt
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </BlurView>
        </ImageBackground>
    );
}