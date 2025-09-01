import * as WebBrowser from "expo-web-browser";
import {useAuth, useOAuth, useUser} from "@clerk/clerk-expo";
import {TouchableOpacity, Text, ActivityIndicator} from "react-native";
import {useWarmUpBrowser} from "@/utils/useWarmUpBrowser";
import {useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {AntDesign} from "@expo/vector-icons";
import {checkUserExistsInSanity, syncUserToSanity} from "@/lib/syncUserToSanity";

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogleButton() {
    useWarmUpBrowser();

    const router = useRouter();
    const {startOAuthFlow} = useOAuth({strategy: "oauth_google"});
    const {user, isLoaded: isUserLoaded} = useUser();

    const [loading, setLoading] = useState(false);

    const {isSignedIn} = useAuth();

    useEffect(() => {
        if (isSignedIn) router.replace('/(tabs)/home');
    }, [isSignedIn]);

    const handlePress = async () => {
        setLoading(true);
        try {
            const {createdSessionId, setActive} = await startOAuthFlow();

            if (createdSessionId && setActive) {
                await setActive({session: createdSessionId});

                // wait for Clerk user to be ready
                if (!isUserLoaded) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                if (user) {
                    const email = user.emailAddresses[0]?.emailAddress || "";

                    // 1. check in Sanity first
                    const exists = await checkUserExistsInSanity(user.id, email);

                    if (!exists) {
                        // 2a. New user → sync and go to complete profile
                        await syncUserToSanity(user);
                        router.push("/(completeProfile)/complete-profile");
                    } else {
                        // 2b. Existing user → just go home
                        router.push("/(tabs)/home");
                    }
                }
            }
        } catch (err) {
            console.error("OAuth error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={loading}
            className="bg-neutral-100 py-3 rounded-full mb-4 flex-row justify-center items-center"
        >
            {loading ? (
                <ActivityIndicator color="#4F46E5"/>
            ) : (
                <>
                    <AntDesign name="google" size={20} color="black" style={{marginRight: 8}}/>
                    <Text className="text-black text-center font-semibold text-lg">
                        Logga in med Google
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}