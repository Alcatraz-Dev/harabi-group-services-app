// app/sign-up.tsx
import {useSignUp, useUser} from '@clerk/clerk-expo';
import {Link, useRouter} from 'expo-router';
import {
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ImageBackground
} from 'react-native';
import React, { useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import SignInWithGoogleButton from '@/components/ui/SignInWithGoogle';
import {BlurView} from "expo-blur";
import {Feather} from "@expo/vector-icons";
import { checkUserExistsInSanity, syncUserToSanity } from "@/lib/syncUserToSanity";

export default function SignUpScreen() {
    const { signUp, setActive, isLoaded } = useSignUp();
    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const { user, isLoaded: isUserLoaded } = useUser();
    const handleSignUp = async () => {
        if (!isLoaded || !signUp || loading) return;

        setLoading(true);
        try {
            await signUp.create({ emailAddress, password });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setCodeSent(true);
        } catch (err: any) {
            Alert.alert('Fel!', err.errors?.[0]?.message || 'Något gick fel.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (code: string) => {
        if (!signUp || verifying) return;

        setVerifying(true);
        try {
            const result = await signUp.attemptEmailAddressVerification({ code });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });

                // Wait until Clerk's user is loaded
                if (!isUserLoaded) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                if (user) {
                    const email = user.emailAddresses[0]?.emailAddress || "";
                    const exists = await checkUserExistsInSanity(user.id, email);

                    if (!exists) {
                        await syncUserToSanity(user);
                        router.replace("/(completeProfile)/complete-profile");
                    } else {
                        router.replace("/(tabs)/home");
                    }
                }
            }
        } catch (err: any) {
            Alert.alert("Fel!", err.errors?.[0]?.message || "Ogiltig kod.");
        } finally {
            setVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!signUp) return;

        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            Alert.alert('Kod skickad', 'En ny kod har skickats till din e-post.');
        } catch (err: any) {
            Alert.alert('Fel!', err.errors?.[0]?.message || 'Kunde inte skicka ny kod.');
        }
    };

    return (
        <ImageBackground
            source={{uri: 'https://images.unsplash.com/photo-1579359565489-8e65439e6d1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
            resizeMode="cover"
            className="flex-1"
        >

            <BlurView intensity={80} tint="dark" className="flex-1 px-6 justify-center">

                <Text className="text-4xl font-bold text-center text-white mb-8">
                    Skapa konto
                </Text>

                {!codeSent ? (
                    <>
                        <TextInput
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                            placeholder="E-postadress"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white  placeholder:text-gray-400"
                        />

                        <View className="flex-row items-center border border-gray-600 bg-neutral-800 p-4 rounded-xl mb-6">
                            <TextInput
                                placeholder="Nytt lösenord"
                                placeholderTextColor="#888"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                className="flex-1 text-white placeholder:text-gray-400"
                            />

                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={showPassword ? '#888' : '#4B5563'} // optional styling
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            className="bg-white dark:bg-white py-4 rounded-full mb-4 shadow-md mt-3"
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-center text-black text-base font-semibold">Skapa konto</Text>
                            )}
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-center my-4 mb-4 mx-10">
                            <View className="flex-1 h-px bg-gray-100 dark:bg-gray-100 " />
                            <Text className="mx-3 text-sm text-gray-100 dark:text-gray-100">
                                Eller logga in med
                            </Text>
                            <View className="flex-1 h-px bg-gray-100 dark:bg-gray-100 " />
                        </View>

                        <SignInWithGoogleButton/>
                        <View className="flex-row justify-between mt-6 px-1">
                            <Link href="/sign-in">
                                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    Jag har redan ett konto !
                                </Text>
                            </Link>

                            <Link href="/forgot-password">
                                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    Glömt lösenord
                                </Text>
                            </Link>
                        </View>
                    </>
                ) : (
                    <>
                        <Text className="text-center mb-4 text-gray-600 dark:text-gray-300">
                            En kod har skickats till din e-post. Ange koden nedan för att verifiera.
                        </Text>

                        <OtpInput
                            numberOfDigits={6}
                            onFilled={handleVerify}
                            theme={{
                                containerStyle: {marginBottom: 20},
                                inputsContainerStyle: {justifyContent: 'space-between'},
                                pinCodeContainerStyle: {
                                    width: 50,
                                    height: 50,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#1A1A1A',
                                    backgroundColor: '#1A1A1A',
                                },
                                pinCodeTextStyle: {
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                },
                                focusedPinCodeContainerStyle: {
                                    borderColor: '#99ff00',
                                },
                            }}
                        />

                        {verifying && <ActivityIndicator size="small" color="#666" className="mb-4" />}

                        <TouchableOpacity onPress={handleResendCode} className="mt-4">
                            <Text className="text-white dark:text-white text-center font-bold text-lg">Skicka ny kod</Text>
                        </TouchableOpacity>
                    </>
                )}
            </BlurView>
        </ImageBackground>
    );
}