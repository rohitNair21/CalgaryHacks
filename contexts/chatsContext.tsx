import type { PropsWithChildren } from "react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
    collection, query, orderBy, where, limit, or, addDoc,
    onSnapshot, serverTimestamp, and, CollectionReference,
} from "firebase/firestore";
import { ConversationObject, createNewConversationArgs, FirestoreConversationObject } from "@/lib/types/chat";
import { conversationConverter, firestore } from "@/lib/firestoreConfig";
import useAuthContext from "@/hooks/useAuthContext";

const initialNumberOfConversations = 10;

type contextObject = {
    conversationsRef: CollectionReference<ConversationObject, FirestoreConversationObject>,
    conversations: ConversationObject[],
    createNewEmptyConversation: (args: createNewConversationArgs) => Promise<string>,
    conversationsAreLoading: boolean,
    fetchMoreConversations: () => void,
};
const ChatsContext = createContext<contextObject | null>(null);

export function ChatsContextProvider({ children }: PropsWithChildren) {
    const { user } = useAuthContext();

    const userId = user!.id;

    // memoizing the reference to the conversations collection
    const conversationsRef = useMemo(() => collection(firestore, "conversations").withConverter(conversationConverter), []);

    // memoizing the query main query used to obtain a user's conversations
    const conversationsQuery = useMemo(() => query(
        conversationsRef,
        and(
            where("lastMessageId", "!=", ""),
            or(
                and(
                    where("firstParticipant.id", "==", userId),
                    where("firstParticipant.deletedAt", "==", null)
                ),
                and(
                    where("secondParticipant.id", "==", userId),
                    where("secondParticipant.deletedAt", "==", null)
                )
            )
        ),
        orderBy("updatedAt", "desc"),
    ), [userId]);

    // A loading state for when more collection data is being retrieved
    const [conversationsAreLoading, setConversationsAreLoading] = useState(true);

    // A state to help determine if there is any more collection data to retrieve
    const [endReached, setEndReached] = useState(false);

    // A state to control the limit of documents to retrieve
    // The approach here is that if someone scrolls to the end, then the limit is increased so that more documents are retrieved
    const [documentsNeeded, setDocumentsNeeded] = useState(initialNumberOfConversations);

    /**
     * Function to fetch more collection documents when user has scrolled to the end
     */
    const fetchMoreConversations = useCallback(() => {
        // Only retrieve more documents if there are any more to be retrieved
        // Doing this prevents an infinite cycle since without this firestore will circle back to beginning
        if (!endReached) {
            setConversationsAreLoading(true);
            setDocumentsNeeded((documentsNeeded) => {
                return documentsNeeded + initialNumberOfConversations;
            });
        }
    }, [endReached]);

    const [conversations, setConversations] = useState<ConversationObject[]>([]);

    const createNewEmptyConversation = useCallback(async (args: createNewConversationArgs) => {
        const { firstParticipant, secondParticipant } = args;

        const timeStamp = serverTimestamp();

        return (await addDoc(conversationsRef, {
            id: "",
            firstParticipant,
            secondParticipant,
            lastMessage: "",
            lastMessageId: "",
            createdAt: timeStamp,
            updatedAt: timeStamp
        })).id;
    }, [conversationsRef]);

    // A useEffect to set up a new query listener when the number of docs needed changes
    useEffect(() => {
        setConversationsAreLoading(true);
        let subscriber = onSnapshot(
            query(conversationsQuery, limit(documentsNeeded)),
            (snapshot) => {
                let results = snapshot.docs.map((doc) => doc.data());
                setConversations(results);
                setEndReached(results.length < documentsNeeded);
                setConversationsAreLoading(false);
            },
        );

        return () => {
            subscriber();
        };
    }, [documentsNeeded, conversationsQuery]);

    return (
        <ChatsContext.Provider
            value={{
                conversationsRef,
                conversations,
                conversationsAreLoading,
                fetchMoreConversations,
                createNewEmptyConversation,
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
}

export default ChatsContext;