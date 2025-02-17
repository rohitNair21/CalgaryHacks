import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import { ConversationObject } from "@/lib/types/chat";
import { MaterialIcons } from "@expo/vector-icons";
import { useFormContext } from "react-hook-form";
import { SearchBarData } from "@/lib/types";
import useAuthContext from "@/hooks/useAuthContext";
import { router } from "expo-router";
import { currentIsFirstParticipant, getProperTimeUpdated } from "@/lib/helper";
import { useEffect, useState } from "react";
import axios from "axios";
import useAppContext from "@/hooks/useAppContext";

const TRANSLATION_API_URL = 'https://calgary-hacks-2025.vercel.app/api/ai/translate';

async function translateText(text: string, targetLanguage: string) {
    const response = await axios.post(TRANSLATION_API_URL, {
        text,
        targetLanguage
    })
    return response.data.text;
}

type Props = {
    conversation: ConversationObject
};
export default function ConversationItem({ conversation }: Props) {
    const { user } = useAuthContext();

    const userId = user?.id ?? "user";

    const unreadMessages = currentIsFirstParticipant(userId, "bot") ?
        conversation.firstParticipant.unreadMessages : conversation.secondParticipant.unreadMessages;

    const timeUpdated = conversation.updatedAt;

    const lastMessage = conversation.lastMessage;

    const onPressHandler = () => {
        router.push(`/chat?id=${conversation.id}`);
    };

    const { watch } = useFormContext<SearchBarData>();

    const searchTerm = watch("searchTerm");

    const [translatedLastMessage, setTranslatedLastMessage] = useState(lastMessage);

    const { userLanguage } = useAppContext();

    useEffect(() => {
        translateText(lastMessage, userLanguage ?? "en").then((text) => {
            setTranslatedLastMessage(text);
        })
    }, [lastMessage, userLanguage])

    return (
        <TouchableHighlight onPress={onPressHandler}>
            <View style={styles.chatListItemContainer}>
                <View style={styles.chatListItemPictureArea}>
                    <MaterialIcons name="person" size={40} />
                </View>
                <View style={styles.chatListItemMessageArea}>
                    <View style={styles.topSection}>
                        <View style={{ width: "69%" }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.userName}
                            >
                                Agent
                            </Text>
                        </View>
                        <View style={{ width: "29%", alignItems: "flex-end" }}>
                            <Text
                                style={{ fontSize: 12, color: unreadMessages > 0 ? "#3a95e9" : "grey" }}
                            >
                                {timeUpdated ? getProperTimeUpdated(timeUpdated.toDate()) : ""}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.bottomSection}>
                        <View style={{ width: "86.5%" }}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.lastMessage}
                            >
                                {translatedLastMessage}
                            </Text>
                        </View>
                        {unreadMessages > 0 && (
                            <View style={styles.unreadMessagesContainer}>
                                <Text style={{ color: "white", fontSize: 12 }}>
                                    {unreadMessages}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    chatListItemContainer: {
        width: "100%",
        paddingLeft: 20,
        height: 80,
        flexDirection: "row",
    },
    chatListItemPictureArea: {
        flex: 0.17,
        justifyContent: "center",
        marginRight: 10,
    },
    chatListItemMessageArea: {
        paddingTop: 10,
        paddingRight: 20,
        flex: 0.83,
        borderBottomWidth: 0.8,
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bottomSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    unreadMessagesContainer: {
        minWidth: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: 3.5,
        borderRadius: 50,
        backgroundColor: "#3a95e9",
    },
    userName: {
        fontSize: 15,
        fontWeight: "bold",
    },
    lastMessage: {
        fontSize: 14,
        color: "grey",
    }
})