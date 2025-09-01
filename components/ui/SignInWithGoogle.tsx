import * as WebBrowser from 'expo-web-browser';
import {useOAuth, useUser} from '@clerk/clerk-expo';
import {TouchableOpacity, Text, ActivityIndicator, Image} from 'react-native';
import {useWarmUpBrowser} from '@/utils/useWarmUpBrowser';
import {useRouter} from 'expo-router';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AntDesign} from "@expo/vector-icons";
import {checkUserExistsInSanity, syncUserToSanity} from "@/lib/syncUserToSanity";

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogleButton() {
    useWarmUpBrowser();

    const router = useRouter();
    const {startOAuthFlow} = useOAuth({strategy: 'oauth_google'});
    const {user, isLoaded: isUserLoaded} = useUser();

    const [loading, setLoading] = useState(false);


    const handlePress = async () => {
        setLoading(true);
        try {
            const {createdSessionId, setActive} = await startOAuthFlow();

            if (createdSessionId && setActive) {
                await setActive({session: createdSessionId});

                if (!isUserLoaded) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                if (user) {
                    await syncUserToSanity(user);


                }

                const exists = await checkUserExistsInSanity(user?.id);
                if (!exists) {
                    router.push('/(completeProfile)/complete-profile');
                } else {

                    if (exists) {
                        router.push('/(tabs)/home');
                    } else {
                        router.push('/(completeProfile)/complete-profile');
                    }
                }

            }
        } catch (err) {
            console.error('OAuth error:', err);
        } finally {
            setLoading(false);
        }
    };
    React.useEffect(() => {
        if (isUserLoaded && user) {
            syncUserToSanity(user);
        }
    }, [isUserLoaded, user]);

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
                    <AntDesign name={'google'} size={20} color="black" className="mr-2"/>

                    <Text className="text-black text-center font-semibold text-lg">
                        Logga in med Google
                    </Text>
                </>

            )}
        </TouchableOpacity>
    );
}