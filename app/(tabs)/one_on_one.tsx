import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, useColorScheme, Image } from 'react-native';
import { Keyboard, Alert} from "react-native"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firestoreConfig";

const TRANSLATION_API_URL = 'https://calgary-hacks-2025.vercel.app/api/ai/translate';

const tintColorLight = '#74003E';
const tintColorDark = '#FCF0F4';

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
    background: '#fff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

const OneOnOne = () => {
    const [message, setMessage] = useState<string>(''); 
    const [messages, setMessages] = useState<{ sent_text: string, sender: 'user' | 'bot', timestamp: string }[]>([]);    const colorScheme = useColorScheme();
    const [agentName, setAgentName] = useState<string | null>(null);
    const theme = Colors[colorScheme || 'light'];
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleBackPress = () => {
        Alert.alert(
            "End Chat",
            "Are you sure you want to leave the chat?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Leave",
                    onPress: () => {
                        Keyboard.dismiss();
                        setMessages(prevMessages => [...prevMessages, { sent_text: "User has ended the chat.", sender: 'system', timestamp: new Date().toLocaleString() }]);
                        setTimeout(() => {
                            setMessages([]);
                            setAgentName(null);
                        }, 3000);
                    }
                }
            ]
        );
    };
    
    useEffect(() => {
        const q = query(collection(firestore, "messages"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData as any);
        });
        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (message.trim()) {
            const timestamp = Timestamp.now();
            await addDoc(collection(firestore, "messages"), {
                sent_text: message,
                sender: 'user',
                timestamp: timestamp
            });
            setMessage('');
        }
    };

    useEffect(() => {
        const q = query(collection(firestore, "messages"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const messagesData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    if (data.sender === 'bot') {
                        const translatedText = await translateMessage(data.sent_text);
                        return { id: doc.id, ...data, sent_text: translatedText };
                    }
                    return { id: doc.id, ...data };
                })
            );
            setMessages(messagesData);
        });
        return () => unsubscribe();
    }, []);

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

    return (
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}> 
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.background }]}> 
                {agentName ? (
                   <View style={styles.agentHeader}>
                       <TouchableOpacity style={styles.backButton}>
                           <Text style={styles.backButtonText} onPress={handleBackPress}>←</Text>
                       </TouchableOpacity>
                       <Image source={require('@/assets/images/agent.png')} style={styles.agentImage} />
                       <Text style={[styles.agentName, { color: theme.text }]}>{agentName}</Text>
                   </View>
               ) : (
                   <Text style={[styles.header, { color: theme.text }]}>One-on-One Chat</Text>
               )}
                {messages.length === 0 ? (
                    <View style={styles.coverContainer}>
                        <View style={styles.emergencyBox}>
                            <Text style={styles.emergencyText}>In a life-threatening situation? Call 911 immediately.</Text>
                        </View>
                        <Image source={require('@/assets/images/chat_page.png')} style={styles.coverImage} />
                        <Text style={[styles.coverText]}>Speak to a professional in the language you’re comfortable with.</Text>
                        <TouchableOpacity style={styles.chatNowButton} onPress={() => setMessages([{ sent_text: 'Hello!', sender: 'user', timestamp: new Date().toLocaleString() }])}>                            
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
                             <Text style={styles.timestamp}>{item.timestamp}</Text>                           
                              </View>
                        )}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 10 }}
                    />
                )}
                <View style={[styles.inputContainer, { backgroundColor: theme.tint, marginBottom: isKeyboardVisible ? 5 : 50 }]}> 
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
    emergencyBox: { backgroundColor: '#FCF0F4', padding: 10, borderRadius: 10, marginBottom: 15 },
    emergencyText: { color: '#74003E', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    coverImage: { maxHeight: '25%', width: '80%', resizeMode: 'contain' },
    coverText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
    chatNowButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 30, backgroundColor: '#74003E', borderRadius: 25 },
    chatNowText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    messageContainer: { padding: 12, marginVertical: 5, borderRadius: 20, maxWidth: '75%' },
    userMessage: { alignSelf: 'flex-end', backgroundColor: '#74003E' },
    botMessage: { alignSelf: 'flex-start', backgroundColor: '#FCF0F4' },
    messageText: { fontSize: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 30 },
    input: { flex: 1, borderWidth: 0, padding: 12, borderRadius: 25, fontSize: 16 },
    sendButton: { marginLeft: 10, padding: 12, borderRadius: 50 },
    sendButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    agentHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    backButton: { marginRight: 10, padding: 5 },
    backButtonText: { fontSize: 24, color: '#74003E' },
    timestamp: { fontSize: 12, color: '#888', textAlign: 'right', marginTop: 5 },
    agentImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    agentName: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
});

export default OneOnOne;
