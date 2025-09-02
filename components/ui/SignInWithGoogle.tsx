import * as WebBrowser from "expo-web-browser";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import { useWarmUpBrowser } from "@/utils/useWarmUpBrowser";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { checkUserExistsInSanity, syncUserToSanity } from "@/lib/syncUserToSanity";

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogleButton() {
    useWarmUpBrowser();

    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const { isSignedIn, getToken } = useAuth(); // Added getToken

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn) router.replace('/(tabs)/home');
    }, [isSignedIn]);

    const handlePress = async () => {
        setLoading(true);
        try {
            console.log("Starting OAuth flow...");

            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId && setActive) {
                console.log("OAuth successful, setting active session...");
                await setActive({ session: createdSessionId });

                // Wait for session to be fully established
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Use Clerk's built-in method to get current user
                // @ts-ignore
                const { user: currentUser } = useAuth();

                if (currentUser) {
                    console.log("👤 Clerk user loaded:", currentUser.id);
                    const email = currentUser.emailAddresses[0]?.emailAddress || "";
                    console.log("User email:", email);

                    // 1. check in Sanity first
                    const exists = await checkUserExistsInSanity(currentUser.id, email);
                    console.log("User exists in Sanity:", exists);

                    if (!exists) {
                        // 2a. New user → sync and go to complete profile
                        console.log("Creating new user in Sanity...");
                        await syncUserToSanity(currentUser);
                        console.log("✅ Sync complete, navigating to profile");
                        router.push("/(completeProfile)/complete-profile");
                    } else {
                        // 2b. Existing user → just go home
                        console.log("User exists, navigating home...");
                        router.push("/(tabs)/home");
                    }
                } else {
                    console.log("No user found, redirecting to complete profile");
                    router.push("/(completeProfile)/complete-profile");
                }
            }
        } catch (err) {
            console.error("OAuth error:", err);
            Alert.alert("Error", "Failed to sign in. Please try again.");
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
                <ActivityIndicator color="#4F46E5" />
            ) : (
                <>
                    <AntDesign name="google" size={20} color="black" style={{ marginRight: 8 }} />
                    <Text className="text-black text-center font-semibold text-lg">
                        Logga in med Google
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}