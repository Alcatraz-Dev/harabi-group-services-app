import React, {useState} from 'react'
import {View, Text, TextInput, TouchableOpacity, Alert, ImageBackground} from 'react-native'
import {useSignIn} from '@clerk/clerk-expo'
import {useRouter} from 'expo-router'
import {BlurView} from "expo-blur";
import {ArrowLeftCircle} from "lucide-react-native";

export default function ForgotPassword() {
    const {signIn, isLoaded} = useSignIn()
    const [email, setEmail] = useState('')
    const router = useRouter()

    const handleResetPassword = async () => {
        if (!isLoaded) return

        try {
            await signIn.create({strategy: 'reset_password_email_code', identifier: email})
            Alert.alert('Instruktioner skickade', 'Kontrollera din e-post för återställningskod.')
            router.push('/reset-password') // صفحة إدخال الكود وكلمة المرور الجديدة
        } catch (err: any) {
            console.error(err)
            Alert.alert('Fel', 'Kunde inte skicka återställningsinstruktioner.')
        }
    }

    return (
        <ImageBackground
            source={{uri: 'https://images.unsplash.com/photo-1579359565489-8e65439e6d1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
            resizeMode="cover"
            className="flex-1"
        >

            <BlurView intensity={80} tint="dark" className="flex-1 px-6 justify-center h-full w-full">


                <TouchableOpacity onPress={() => router.back()} className="absolute top-20 left-6">
                    <ArrowLeftCircle
                        size={25}
                        color={'#fff'}
                    />
                </TouchableOpacity>


                <Text className="text-4xl font-bold text-center text-white mb-8">
                    Glömt lösenord ?
                </Text>

                <Text className="text-white mb-8 text-center ">
                    Ange din e-postadress för att återställa ditt lösenord.
                </Text>

                <TextInput
                    className="border border-gray-600 bg-neutral-800 dark:bg-neutral-800 p-4 rounded-xl mb-4 text-white  placeholder:text-gray-400"
                    autoCorrect={false}
                    placeholder="E-postadress"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity
                    onPress={handleResetPassword}
                    className="bg-white py-4 rounded-full mt-3"
                >
                    <Text className="text-center text-black font-semibold">
                        Skicka instruktioner
                    </Text>
                </TouchableOpacity>
            </BlurView>

        </ImageBackground>
    )
}