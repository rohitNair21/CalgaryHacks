import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

const OneOnOne = () => {
    const [message, setMessage] = useState<string>(''); 
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessages = [
                ...messages,
                { text: message, sender: 'user' },
                { text: `Echo: ${message}`, sender: 'bot' } 
            ];
            setMessages(newMessages as { text: string; sender: "user" | "bot"; }[]);
            setMessage('');
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Text style={styles.header}>One-on-One Chat</Text>
                <FlatList
                    data={messages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
                            <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.botText]}>{item.text}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 10 }}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#888"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: '#121212' },
    container: { flex: 1, padding: 20, backgroundColor: '#1E1E1E' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: 'white' },
    messageContainer: { padding: 12, marginVertical: 5, borderRadius: 20, maxWidth: '75%' },
    userMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
    botMessage: { alignSelf: 'flex-start', backgroundColor: '#444' },
    messageText: { fontSize: 16 },
    userText: { color: 'white' },
    botText: { color: 'white' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 60, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#333', borderRadius: 30 },
    input: { flex: 1, borderWidth: 0, padding: 12, borderRadius: 25, backgroundColor: '#222', color: 'white', fontSize: 16 },
    sendButton: { marginLeft: 10, padding: 12, backgroundColor: '#007AFF', borderRadius: 50 },
    sendButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});

export default OneOnOne;
