import { useContext } from "react";
import ChatsContext from "../contexts/chatsContext";

export default function useChatsContext() {
    const context = useContext(ChatsContext);
    if (!context)
        throw new Error("useChatsContext must be used within a ChatsContextProvider");
    return context;
}