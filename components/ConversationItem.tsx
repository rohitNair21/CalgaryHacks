import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import { ConversationObject } from "@/lib/types/chat";
import { MaterialIcons } from "@expo/vector-icons";
import { useFormContext } from "react-hook-form";
import { SearchBarData } from "@/lib/types";
import useAuthContext from "@/hooks/useAuthContext";

const currentIsFirstParticipant = (currentUserId: string, otherEndUserId: string) => {
    return currentUserId < otherEndUserId;
}

type DayOfTheWeek =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";

const daysOfTheWeek: DayOfTheWeek[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

/**
 * If the target is within the same day then time is returned.
 * If it is within one week then the day is returned.
 * Otherwise the date is returned
 * @param targetDateInstance
 * @returns
 */
export const getProperTimeUpdated = (targetDateInstance: Date) => {
    const targetDay = targetDateInstance.getDay();
    const targetDate = targetDateInstance.getDate();
    const targetMonth = targetDateInstance.getMonth() + 1;
    const targetYear = targetDateInstance.getFullYear();

    const currentDateInstance = new Date();
    const currentDay = currentDateInstance.getDay();
    const currentDate = currentDateInstance.getDate();
    const currentMonth = currentDateInstance.getMonth() + 1;
    const currentYear = currentDateInstance.getFullYear();

    const daysAreSimilar = targetDay === currentDay;
    const targetIsWithinSameDay =
        daysAreSimilar &&
        targetDate === currentDate &&
        targetMonth === currentMonth &&
        targetYear === currentYear;

    if (targetIsWithinSameDay)
        return targetDateInstance.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    const yesterday = new Date(currentDateInstance);
    yesterday.setDate(currentDate - 1);

    if (targetDateInstance.getTime() > yesterday.getTime()) return "Yesterday";

    const sevenDaysAgo = new Date(currentDateInstance);
    sevenDaysAgo.setDate(currentDate - 7);

    if (!daysAreSimilar && targetDateInstance.getTime() > sevenDaysAgo.getTime())
        return daysOfTheWeek[targetDay];

    return `${targetYear}-${targetMonth}-${targetDate}`;
};

type Props = {
    conversation: ConversationObject
};
export default function ConversationItem({ conversation }: Props) {
    const { user } = useAuthContext();

    const userId = user!.id;

    const unreadMessages = currentIsFirstParticipant(userId, "bot") ?
        conversation.firstParticipant.unreadMessages : conversation.secondParticipant.unreadMessages;

    const timeUpdated = conversation.updatedAt;

    const lastMessage = conversation.lastMessage;

    const onPressHandler = () => {

    };

    const { watch } = useFormContext<SearchBarData>();

    const searchTerm = watch("searchTerm");

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
                                {lastMessage}
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