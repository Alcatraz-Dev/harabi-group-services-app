import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type MessageBubbleProps = {
    text: string;
    sender: 'user' | 'support';
};

export default function MessageBubble({ text, sender }: MessageBubbleProps) {
    const isUser = sender === 'user';

    return (
        <View
            style={[
                styles.container,
                isUser ? styles.containerUser : styles.containerSupport,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleSupport,
                ]}
            >
                <Text style={isUser ? styles.textUser : styles.textSupport}>{text}</Text>

                {/* الذيل - باستخدام position absolute */}
                <View
                    style={[
                        styles.tail,
                        isUser ? styles.tailUser : styles.tailSupport,
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    containerUser: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    containerSupport: {
        alignSelf: 'flex-start',
    },

    bubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        position: 'relative',
    },
    bubbleUser: {
        backgroundColor: '#0B93F6',
    },
    bubbleSupport: {
        backgroundColor: '#E5E5EA',
    },

    textUser: {
        color: 'white',
        fontSize: 16,
    },
    textSupport: {
        color: 'black',
        fontSize: 16,
    },

    tail: {
        position: 'absolute',
        bottom: 0,
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    tailUser: {
        right: -10,
        borderLeftWidth: 10,
        borderLeftColor: '#0B93F6',
    },
    tailSupport: {
        left: -10,
        borderRightWidth: 10,
        borderRightColor: '#E5E5EA',
    },
});