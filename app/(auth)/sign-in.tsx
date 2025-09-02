import {useAuth, useSignIn, useUser} from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useRouter, Link } from "expo-router";
import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ImageBackground,
} from "react-native";
import SignInWithGoogleButton from "@/components/ui/SignInWithGoogle";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import {createUserInSanityFromClerk} from "@/lib/syncUserToSanity";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            router.replace('/(tabs)/home'); // navigate to home screen
        }
    }, [isSignedIn]);

    const [showPassword, setShowPassword] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!isLoaded || !signIn) return;
        setLoading(true);

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });

                // Wait until Clerk fully loads the user object
                let attempts = 0;
                while (!user && attempts < 10) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    attempts++;
                }

                if (user) {
                    // const exists = await checkUserExistsInSanity(user.id);

                    // if (!exists) {
                        await createUserInSanityFromClerk(user.id)
                        router.replace("/(completeProfile)/complete-profile");
                    // } else {
                    //     router.replace("/(tabs)/home");
                    // }
                } else {
                    console.warn("User not ready after sign-in.");
                }
            }else {
                console.log("Sign-in incomplete:", result);
            }
        } catch (err: any) {
            Alert.alert("Fel!", err.errors?.[0]?.message || "Något gick fel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={{
                uri: "https://images.unsplash.com/photo-1579359565489-8e65439e6d1c?q=80&w=3270&auto=format&fit=crop",
            }}
            resizeMode="cover"
            className="flex-1"
        >
            <BlurView intensity={80} tint="dark" className="flex-1 px-6 justify-center">
                <View>
                    <Text className="text-4xl font-bold text-center text-white mb-8">
                        Logga in
                    </Text>

                    <TextInput
                        className="border border-gray-600 bg-neutral-800 p-4 rounded-xl mb-4 text-white placeholder:text-gray-400"
                        placeholder="E-postadress"
                        autoCorrect={false}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                    />

                    <View className="flex-row items-center border border-gray-600 bg-neutral-800 p-4 rounded-xl mb-6">
                        <TextInput
                            placeholder="Lösenord"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            className="flex-1 text-white placeholder:text-gray-400"
                        />

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color={showPassword ? "#888" : "#4B5563"}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="bg-white py-4 rounded-full mb-4 shadow-md mt-3"
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className="text-center text-black text-base font-semibold">
                                Logga in
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center justify-center my-4 mb-4 mx-10">
                        <View className="flex-1 h-px bg-gray-100" />
                        <Text className="mx-3 text-sm text-gray-100">Eller logga in med</Text>
                        <View className="flex-1 h-px bg-gray-100" />
                    </View>

                    <SignInWithGoogleButton />

                    <View className="flex-row justify-between mt-6 px-1">
                        <Link href="/sign-up">
                            <Text className="text-sm text-blue-400 font-medium">
                                Skapa konto
                            </Text>
                        </Link>

                        <Link href="/forgot-password">
                            <Text className="text-sm text-blue-400 font-medium">
                                Glömt lösenord ?
                            </Text>
                        </Link>
                    </View>
                </View>
            </BlurView>
        </ImageBackground>
    );
}