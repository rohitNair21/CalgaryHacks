import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, useColorScheme, Image } from 'react-native';

const TRANSLATION_API_URL = 'https://calgary-hacks-2025.vercel.app/api/ai/translate';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

const OneOnOne = () => {
    const [message, setMessage] = useState<string>(''); 
    const [messages, setMessages] = useState<{ sent_text: string, sender: 'user' | 'bot' }[]>([]);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme || 'light'];

    const translateMessage = async (sent_text: string) => {
        try {
            const response = await fetch(TRANSLATION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: sent_text, targetLanguage: "de" })
            });
            const data = await response.json();
            return data.text || sent_text;
        } catch (error) {
            console.error('Translation error:', error);
            return sent_text; 
        }
    };

    const sendMessage = async () => {
        if (message.trim()) {
            const translatedMessage = await translateMessage(message);
            const newMessages = [
                ...messages,
                { sent_text: message, sender: 'user' },
                { sent_text: `Echo: ${translatedMessage}`, sender: 'bot' } 
            ];
            setMessages(newMessages as { sent_text: string; sender: "user" | "bot"; }[]);
            setMessage('');
        }
    };

    return (
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}> 
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.background }]}> 
                <Text style={[styles.header, { color: theme.text }]}>One-on-One Chat</Text>
                {messages.length === 0 ? (
                    <View style={styles.coverContainer}>
                        <Image source={require('@/assets/images/chat_page.png')} style={styles.coverImage} />
                        <Text style={[styles.coverText, { color: theme.text }]}>Speak to a professional in the language you’re comfortable with.</Text>
                        <TouchableOpacity style={styles.chatNowButton} onPress={() => setMessage('')}>
                            <Text style={styles.chatNowText}>Chat now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}> 
                                <Text style={[styles.messageText, item.sender === 'user' ? { color: '#fff' } : { color: theme.text }]}>{item.sent_text}</Text>
                            </View>
                        )}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 10 }}
                    />
                )}
                <View style={[styles.inputContainer, { backgroundColor: theme.tint }]}> 
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.icon}
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.tint }]} onPress={sendMessage}> 
                        <Text style={styles.sendButtonText}>➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: { flex: 1 },
    container: { flex: 1, padding: 20 },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    coverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    coverImage: { width: '80%', resizeMode: 'contain' },
    coverText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
    chatNowButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 30, backgroundColor: '#C8102E', borderRadius: 25 },
    chatNowText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    messageContainer: { padding: 12, marginVertical: 5, borderRadius: 20, maxWidth: '75%' },
    userMessage: { alignSelf: 'flex-end', backgroundColor: '#0a7ea4' },
    botMessage: { alignSelf: 'flex-start', backgroundColor: '#444' },
    messageText: { fontSize: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 60, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 30 },
    input: { flex: 1, borderWidth: 0, padding: 12, borderRadius: 25, fontSize: 16 },
    sendButton: { marginLeft: 10, padding: 12, borderRadius: 50 },
    sendButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});

export default OneOnOne;
