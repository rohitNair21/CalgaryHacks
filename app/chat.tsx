import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, useColorScheme, Image } from 'react-native';
import { Keyboard, Alert } from "react-native"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, where, limit, updateDoc, doc, increment } from "firebase/firestore";
import { conversationConverter, firestore, messageConverter } from "@/lib/firestoreConfig";
import { router, useLocalSearchParams } from 'expo-router';
import { MessageObject } from '@/lib/types/chat';
import { FlashList } from '@shopify/flash-list';
import useAuthContext from '@/hooks/useAuthContext';
import { getProperTimeUpdated } from '@/lib/helper';

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

type createNewMessageArgs = {
    sent_text: string;
    sender: string;
};

const initialNumberOfMessages = 10;

export default function ChatScreen() {
    const { user } = useAuthContext();

    const userId = "67b15c7c97869aa85f2e1b13"//user!.id;

    const { id } = useLocalSearchParams<{ id: string }>();

    const [message, setMessage] = useState<string>('');

    const messagesRef = useMemo(() => collection(firestore, "messages").withConverter(messageConverter), []);

    const messagesQuery = useMemo(() => query(
        messagesRef,
        where("conversationId", "==", id),
        orderBy("createdAt", "desc"),
    ), [id]);

    const [agentName, setAgentName] = useState<string | null>(null);

    const theme = Colors['light'];

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
                        router.back();
                    }
                }
            ]
        );
    };

    // A loading state for when more collection data is being retrieved
    const [messagesAreLoading, setMessagesAreLoading] = useState(true);

    // A state to help determine if there is any more collection data to retrieve
    const [endReached, setEndReached] = useState(false);

    // A state to control the limit of documents to retrieve
    // The approach here is that if someone scrolls to the end, then the limit is increased so that more documents are retrieved
    const [documentsNeeded, setDocumentsNeeded] = useState(initialNumberOfMessages);

    /**
     * Function to fetch more collection documents when user has scrolled to the end
     */
    const fetchMoreConversations = useCallback(() => {
        // Only retrieve more documents if there are any more to be retrieved
        // Doing this prevents an infinite cycle since without this firestore will circle back to beginning
        if (!endReached) {
            setMessagesAreLoading(true);
            setDocumentsNeeded((documentsNeeded) => {
                return documentsNeeded + initialNumberOfMessages;
            });
        }
    }, [endReached]);

    const [messages, setMessages] = useState<MessageObject[]>([]);

    const createNewEmptyMessage = useCallback(async (args: createNewMessageArgs) => {
        const timeStamp = serverTimestamp();

        const messageDoc = await addDoc(messagesRef, {
            id: "",
            conversationId: id,
            message: {
                type: "text",
                content: args.sent_text,
            },
            senderId: args.sender,
            receiverId: "bot",
            createdAt: timeStamp,
            timeRead: null,
        })

        await updateDoc(
            doc(firestore, "conversations", id).withConverter(
                conversationConverter,
            ),
            {
                lastMessage: args.sent_text,
                lastMessageId: messageDoc.id,
                "secondParticipant.unreadMessages": increment(1),
                updatedAt: serverTimestamp(),
            },
        )
    }, [messagesRef]);

    // A useEffect to set up a new query listener when the number of docs needed changes
    useEffect(() => {
        setMessagesAreLoading(true);
        let subscriber = onSnapshot(
            query(messagesQuery, limit(documentsNeeded)),
            (snapshot) => {
                let results = snapshot.docs.map((doc) => doc.data());
                setMessages(results);
                setEndReached(results.length < documentsNeeded);
                setMessagesAreLoading(false);
            },
        );

        return () => {
            subscriber();
        };
    }, [documentsNeeded, messagesQuery]);

    const sendMessage = useCallback(async () => {
        if (message.trim()) {
            const messageId = await createNewEmptyMessage({ sent_text: message, sender: userId });
            setMessage("");
        }
    }, [message, createNewEmptyMessage]);

    return (
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, { backgroundColor: theme.background }]}
            >
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
                <FlashList
                    estimatedItemSize={100}
                    data={messages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.messageContainer, item.senderId === userId ? styles.userMessage : styles.botMessage]}>
                            <Text style={[styles.messageText, item.senderId === userId ? { color: '#fff' } : { color: theme.text }]}>{item.message.content}</Text>
                            {item.createdAt && <Text style={styles.timestamp}>{getProperTimeUpdated(item.createdAt.toDate())}</Text>}
                        </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                />
                <View style={[styles.inputContainer, { backgroundColor: theme.tint, marginBottom: 50 }]}>
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
    container: { flex: 1 },
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