import { Timestamp } from "firebase/firestore";

type MessageType = "text" | "image" | "video";

export type MessageObject = {
    id: string,
    senderId: string,
    receiverId: string,
    conversationId: string,
    message: {
        type: MessageType,
        content: string
    },
    createdAt: Timestamp,
    timeRead: Timestamp | null
}

export type FirestoreMessageObject = {
    senderId: string,
    receiverId: string,
    conversationId: string,
    message: {
        type: MessageType,
        content: string
    },
    createdAt: Timestamp,
    timeRead: Timestamp | null
}

type ConversationParticipant = {
    id: string,
    unreadMessages: number,
    deletedAt: Timestamp | null,
    isTyping: boolean
}

export type ConversationObject = {
    id: string,
    firstParticipant: ConversationParticipant,
    secondParticipant: ConversationParticipant,
    lastMessage: string,
    lastMessageId: string,
    createdAt: Timestamp,
    updatedAt: Timestamp
}

export type FirestoreConversationObject = {
    firstParticipant: ConversationParticipant,
    secondParticipant: ConversationParticipant,
    lastMessage: string,
    lastMessageId: string,
    createdAt: Timestamp,
    updatedAt: Timestamp
}

export type createNewConversationArgs = {
    otherEndUserId: string,
    firstParticipant: ConversationParticipant,
    secondParticipant: ConversationParticipant
}