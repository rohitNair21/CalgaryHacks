import { initializeApp } from "firebase/app";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    WithFieldValue,
    getFirestore,
} from "firebase/firestore";
import {
    ConversationObject,
    FirestoreConversationObject,
    FirestoreMessageObject,
    MessageObject,
} from "./types/chat";

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

export const messageConverter: FirestoreDataConverter<MessageObject, FirestoreMessageObject> = {
    toFirestore(doc: WithFieldValue<MessageObject>) {
        const { id, ...payLoad } = doc as MessageObject;
        return payLoad;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<MessageObject, FirestoreMessageObject>,
        options: SnapshotOptions,
    ) {
        const data = snapshot.data(options);
        const {
            senderId, receiverId, conversationId,
            message, createdAt, timeRead
        } = data;
        return {
            id: snapshot.id,
            senderId,
            receiverId,
            conversationId,
            message,
            createdAt,
            timeRead,
        };
    }
};

export const conversationConverter: FirestoreDataConverter<ConversationObject, FirestoreConversationObject> = {
    toFirestore(doc: WithFieldValue<ConversationObject>) {
        const { id, ...payLoad } = doc as ConversationObject;
        return payLoad;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<ConversationObject, FirestoreConversationObject>,
        options: SnapshotOptions,
    ) {
        const data = snapshot.data(options);
        const {
            firstParticipant, secondParticipant,
            lastMessage, lastMessageId, createdAt, updatedAt
        } = data;
        return {
            id: snapshot.id,
            firstParticipant,
            secondParticipant,
            lastMessage,
            lastMessageId,
            createdAt,
            updatedAt
        };
    }
};