import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/hooks/useTheme";
import { Send } from 'lucide-react-native';
import MessageBubble from "@/components/ui/MessageBubble";

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'support';
};

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hej! Hur kan vi hjälpa dig?', sender: 'support' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'user',
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const router = useRouter();
    const { theme: colorScheme } = useAppTheme();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900 p-4">

            <View className="flex-row items-center justify-between px-5 py-4 mb-6">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <ArrowLeftCircle
                        size={25}
                        color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                    />
                </TouchableOpacity>
                <Text className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    Support Chat
                </Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <MessageBubble text={item.text} sender={item.sender} />
                )}

                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View className="flex-row items-center mt-2 mb-20">
                <TextInput
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-5 py-4  text-black dark:text-white"
                    placeholder="Skriv ett meddelande..."
                    placeholderTextColor="#999"
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity onPress={sendMessage} className="ml-1 px-4 py-2 rounded-lg">
                    <Send color={colorScheme === 'dark' ? 'white' : 'black'} size={20} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}