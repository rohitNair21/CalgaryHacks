import { SearchBarContextProvider } from "@/contexts/searchBarContext";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, TextInput, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useFormContext } from "react-hook-form";
import { SearchBarData } from "@/lib/types";
import { useCallback, useState } from "react";
import useChatsContext from "@/hooks/useChatsContext";
import { FlashList } from "@shopify/flash-list";
import ConversationItem from "@/components/ConversationItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function dismissKeyboard() {
    Keyboard.dismiss();
}

function SearchArea() {
    const { control } = useFormContext<SearchBarData>();

    return (
        <View style={styles.searchArea}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={dismissKeyboard}>
                    <Ionicons name="search" size={20} />
                </TouchableOpacity>
                <Controller
                    control={control}
                    name="searchTerm"
                    render={({ field: { onBlur, onChange, value } }) => (
                        <TextInput
                            placeholder="Search Chats"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            style={styles.searchInput}
                        />
                    )}
                />
            </View>
        </View>
    )
}

const initialNumberOfConversations = 10;

function ConversationsArea() {
    const { conversations, fetchMoreConversations, conversationsAreLoading } = useChatsContext();

    const [moreDataFetchingAllowed, setMoreDataFetchingAllowed] = useState(false);
    const allowMoreDataFetching = useCallback(() => {
        setMoreDataFetchingAllowed(true);
    }, []);

    const getMoreConversations = () => {
        if (
            moreDataFetchingAllowed &&
            conversations.length >= initialNumberOfConversations
        )
            fetchMoreConversations();
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {
                    conversations.length > 0 ?
                        <FlashList
                            onScroll={allowMoreDataFetching}
                            ListHeaderComponent={() => <View style={{ height: 10 }}></View>}
                            ListFooterComponent={() => (
                                conversationsAreLoading ?
                                    <ActivityIndicator />
                                    : <View style={{ height: 10 }}></View>
                            )}
                            estimatedItemSize={40}
                            data={conversations}
                            renderItem={({ item }) => (
                                <ConversationItem conversation={item} />
                            )}
                            onEndReached={getMoreConversations}
                            onEndReachedThreshold={0}
                        />
                        : <View style={styles.emptyChatListArea}>
                            <Text style={{ fontSize: 20, fontFamily: "Noto-Bold" }}>
                                No conversations at the moment
                            </Text>
                        </View>
                }
            </View>
        </View>
    );
}

function ChatsList() {
    return (
        <View style={{ flex: 1 }}>
            <SearchBarContextProvider>
                <SearchArea />
                <ConversationsArea />
            </SearchBarContextProvider>
        </View>
    )
}

export default function Chats() {
    const insets = useSafeAreaInsets();
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ChatsList />
                {/* <SignedIn>
                <ChatsList />
            </SignedIn>
            <SignedOut>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>You need to sign in to see your chats</Text>
                </View>
            </SignedOut> */}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchArea: {
        paddingHorizontal: 20,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 0.3
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        height: 32,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 8
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 0
    },
    emptyChatListArea: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center"
    }
})