import { SearchBarContextProvider } from "@/contexts/searchBarContext";
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, TextInput, ActivityIndicator, TouchableWithoutFeedback, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useFormContext } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import useChatsContext from "@/hooks/useChatsContext";
import { FlashList } from "@shopify/flash-list";
import ConversationItem from "@/components/ConversationItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthContext from "@/hooks/useAuthContext";
import { router } from "expo-router";
import useAppContext from "@/hooks/useAppContext";
import axios from "axios";

function dismissKeyboard() {
    Keyboard.dismiss();
}

function SearchArea() {
    const { control } = useFormContext();

    return (
        <View style={styles.searchArea}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={dismissKeyboard}>
                    <Ionicons name="search" size={20} color="#888" />
                </TouchableOpacity>
                <Controller
                    control={control}
                    name="searchTerm"
                    render={({ field: { onBlur, onChange, value } }) => (
                        <TextInput
                            placeholder="Search for a chat"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            style={styles.searchInput}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const initialNumberOfConversations = 10;

const TRANSLATION_API_URL = 'https://calgary-hacks-2025.vercel.app/api/ai/translate';

async function translateText(text: string, targetLanguage: string) {
    try {
        const response = await axios.post(TRANSLATION_API_URL, {
            text,
            targetLanguage
        })
        return response.data.text;
    } catch (error) {
        console.error(error);
        return text;
    }
}

function EmptySection() {
    const { user } = useAuthContext();
    const userId = user?.id ?? "user";
    const { createNewEmptyConversation } = useChatsContext();

    const { userLanguage } = useAppContext();

    const [content, setContent] = useState({
        warningTitle: "In a life-threatening situation?",
        warningText: "Do not use this app. Call 911 (Emergency) or 988 (National Suicide Prevention Lifeline).",
        emptyChatTitle: "Speak to a professional, in the language you’re comfortable with",
        emptyChatSubtitle: "Talk to trained agents and learn where to find help through a safe and secure 1-on-1 environment.",
        chatButtonText: "Chat now"
    });

    useEffect(() => {
        const translateContent = async () => {
            const [warningTitle, warningText, emptyChatTitle, emptyChatSubtitle, chatButtonText] = await Promise.all([
                translateText(content.warningTitle, userLanguage ?? "en"),
                translateText(content.warningText, userLanguage ?? "en"),
                translateText(content.emptyChatTitle, userLanguage ?? "en"),
                translateText(content.emptyChatSubtitle, userLanguage ?? "en"),
                translateText(content.chatButtonText, userLanguage ?? "en")
            ])
            setContent({
                warningTitle,
                warningText,
                emptyChatTitle,
                emptyChatSubtitle,
                chatButtonText
            })
        }
        translateContent();
    }, [userLanguage]);

    const handleStartChat = async () => {
        const conversationId = await createNewEmptyConversation({
            firstParticipant: {
                id: userId,
                unreadMessages: 0,
                deletedAt: null,
                isTyping: false
            },
            secondParticipant: {
                id: "bot",
                unreadMessages: 0,
                deletedAt: null,
                isTyping: false
            }
        });
        router.push(`/chat?id=${conversationId}`);
    }

    return (
        <View style={styles.emptyChatContainer}>
            <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>{content.warningTitle}</Text>
                <Text style={styles.warningText}>{content.warningText}</Text>
            </View>
            <Image source={require("@/assets/images/chat_page.png")} style={styles.illustration} />
            <Text style={styles.emptyChatTitle}>{content.emptyChatTitle}</Text>
            <Text style={styles.emptyChatSubtitle}>{content.emptyChatSubtitle}</Text>
            <TouchableOpacity
                onPress={handleStartChat}
                style={styles.chatButton}
            >
                <Text style={styles.chatButtonText}>{content.chatButtonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

function ConversationsArea() {
    const { conversations, fetchMoreConversations, conversationsAreLoading } = useChatsContext();
    const [moreDataFetchingAllowed, setMoreDataFetchingAllowed] = useState(false);
    const allowMoreDataFetching = useCallback(() => setMoreDataFetchingAllowed(true), []);

    if (conversations.length === 0)
        return <EmptySection />

    return (
        <View style={{ flex: 1 }}>
            <FlashList
                onScroll={allowMoreDataFetching}
                ListHeaderComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={() => (conversationsAreLoading ? <ActivityIndicator /> : <View style={{ height: 10 }} />)}
                estimatedItemSize={40}
                data={conversations}
                renderItem={({ item }) => <ConversationItem conversation={item} />}
                onEndReached={fetchMoreConversations}
                onEndReachedThreshold={0}
            />
        </View>
    );
}

export default function Chats() {
    const insets = useSafeAreaInsets();
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <SearchBarContextProvider>
                    <SearchArea />
                    <ConversationsArea />
                </SearchBarContextProvider>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    searchArea: {
        paddingHorizontal: 20,
        height: 80,
        justifyContent: "center",
        borderBottomWidth: 0.3,
        borderBottomColor: "#ddd"
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
    },
    emptyChatContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    warningBox: {
        backgroundColor: "#FCE8E6",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20
    },
    warningTitle: {
        fontWeight: "bold",
        color: "#7D1E1E",
        fontSize: 16
    },
    warningText: {
        color: "#7D1E1E",
        fontSize: 14
    },
    illustration: {
        width: 200,
        height: 150,
        marginBottom: 20,
        resizeMode: "contain"
    },
    emptyChatTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10
    },
    emptyChatSubtitle: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        marginBottom: 20
    },
    chatButton: {
        backgroundColor: "#80003A",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25
    },
    chatButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});