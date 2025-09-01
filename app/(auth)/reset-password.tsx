import React, {useState} from 'react'
import {View, Text, TextInput, TouchableOpacity, Alert, ImageBackground} from 'react-native'
import {useSignIn} from '@clerk/clerk-expo'
import {useRouter} from 'expo-router'
import {OtpInput} from "react-native-otp-entry";
import {BlurView} from "expo-blur";
import {Feather} from "@expo/vector-icons";
import {ArrowLeftCircle} from "lucide-react-native";

export default function ResetPassword() {
    const {signIn, isLoaded} = useSignIn()
    const router = useRouter()

    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const handleSubmit = async () => {
        if (!isLoaded) return

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password: newPassword,
            })

            if (result.status === 'complete') {
                Alert.alert('Lösenord uppdaterat', 'Du kan nu logga in med ditt nya lösenord.')
                router.replace('/sign-in') // أو الصفحة الرئيسية بعد تسجيل الدخول
            } else {
                console.log('Behöver mer verifiering:', result)
            }
        } catch (err: any) {
            console.error(err)
            Alert.alert('Fel', 'Koden är felaktig eller ogiltig.')
        }
    }

    return (
        <ImageBackground
            source={{uri: 'https://images.unsplash.com/photo-1579359565489-8e65439e6d1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
            resizeMode="cover"
            className="flex-1"
        >

            <BlurView intensity={80} tint="dark" className="flex-1 px-6 justify-center">
                <TouchableOpacity onPress={() => router.back()} className="absolute top-20 left-6">
                    <ArrowLeftCircle
                        size={25}
                        color={'#fff'}
                    />
                </TouchableOpacity>
                <Text className="text-4xl font-bold text-center text-white mb-8">
                Återställ lösenord
                </Text>

                <Text className="text-white mb-8 text-center leading-tight">
                    Ange koden som skickades till din e-postadress och välj ett nytt lösenord.
                </Text>


                <OtpInput
                    numberOfDigits={6}
                    onFilled={(value) => setCode(value)}
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
                <View className="flex-row items-center border border-gray-600 bg-neutral-800 p-4 rounded-xl mb-6">
                    <TextInput
                        placeholder="Nytt lösenord"
                        placeholderTextColor="#888"
                        value={newPassword}
                        onChangeText={setNewPassword}
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
                    onPress={handleSubmit}
                    className="bg-white py-3 rounded-full mt-3"
                >
                    <Text className="text-center text-black font-semibold">
                        Uppdatera lösenord
                    </Text>
                </TouchableOpacity>
            </BlurView>
        </ImageBackground>
    )
}