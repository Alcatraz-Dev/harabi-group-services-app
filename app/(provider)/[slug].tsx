import {View, Text, Image, Linking, TouchableOpacity, ScrollView, useColorScheme, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {client} from '@/client';
import {Phone, MessageSquare, MessageCircle, Share2, ArrowLeftCircle} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ProviderBySlug = () => {
    const {providerId} = useLocalSearchParams();
    const [provider, setProvider] = useState<any>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        if (!providerId) return;

        const query = `*[_type == "provider" && _id == $id][0]{
      _id,
      name,
      slug,
      description,
      avatar {
        asset->{
          url
        }
      },
      role,
      roleResponsibilities,
      phoneNumber,
      whatsappNumber
    }`;

        client.fetch(query, {id: providerId}).then(setProvider);
    }, [providerId]);

    if (!provider) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-neutral-900">
                <Text className="text-lg text-gray-500 dark:text-gray-300">Laddar...</Text>
            </View>
        );
    }
    const handleCall = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleChat = () => {
        const message = encodeURIComponent("Hej! Jag är intresserad av er tjänst och vill gärna få mer information.");
        const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`;
        Linking.openURL(url).catch(() => {
            Alert.alert('Fel', 'Det gick inte att öppna WhatsApp.');
        });
    };

    const {name, avatar, role, description, phoneNumber, whatsappNumber} = provider;
    const router = useRouter();
    return (
        <SafeAreaView className={'flex-1 bg-white dark:bg-neutral-900  '}>
            <View className=" flex flex-row justify-between px-5">
                <ArrowLeftCircle size={25} color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                                 onPress={() => router.back()}/>
            </View>
            {/* Header Title */}
            <View className="flex-row items-center justify-center ">
                <Text className="text-gray-800 dark:text-white text-2xl font-extrabold">Om {role}</Text>
            </View>

            <ScrollView className="flex-1 bg-white dark:bg-neutral-900   px-6 py-8">


                {/* Avatar and Name */}
                <View className="items-center mb-8">
                    <Image
                        source={{uri: avatar?.asset?.url || undefined}}
                        className="w-32 h-32 rounded-full border-4"
                        style={{
                            borderColor: isDark ? '#1f2937' : '#f3f4f6',
                        }}
                    />
                    <Text className={`mt-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</Text>
                    <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{role}</Text>
                </View>

                {/* Description */}
                {description ? (
                    <Text className={`text-center mb-8 text-base px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {description}
                    </Text>
                ) : null}
                {/* Action Buttons */}
                <View className="flex-row justify-around">
                    {phoneNumber &&  role === "Superadministratör" && (

                        <View className="flex-row justify-around mt-6">
                            <TouchableOpacity onPress={handleCall} className="items-center">
                                <Phone size={24} color="#1E90FF"/>
                                <Text className="text-sm text-blue-600 mt-1">Call</Text>
                            </TouchableOpacity>

                        </View>
                    )}

                    {whatsappNumber &&  role === "Superadministratör" && (
                        <View className="flex-row justify-around mt-6">
                            <TouchableOpacity onPress={handleChat} className="items-center">
                                <MessageCircle size={24} color="#32CD32"/>
                                <Text className="text-sm text-green-600 mt-1">Chat</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {/* Role Responsibilities */}
                {provider.roleResponsibilities && provider.roleResponsibilities.length > 0 && (
                    <View className="my-10 px-2">

                        <View className={`bg-${isDark ? 'neutral-800' : 'neutral-100'} rounded-2xl p-4 shadow-md`}>
                            {provider.roleResponsibilities.map((task: string, index: number) => (
                                <View key={index} className="flex-row items-start my-3">
                                    {/* Bullet Icon */}
                                    <View className={`w-2 h-2 rounded-full mt-2 mr-3 ${isDark ? 'bg-blue-400 ' : 'bg-blue-600'}`} />
                                    <Text
                                        className={`flex-1 text-base  ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                        style={{ lineHeight: 22 }}
                                    >
                                        {task}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

export default ProviderBySlug;