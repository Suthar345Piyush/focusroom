// use chat hook for sending messages to all in the room 

import { chatMessageSchema } from "@/lib/validators/profile.schema";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";
import { useCallback, useRef, useEffect } from "react";



export function useChat() {
     const {messages, unreadCount, isPanelOpen, markRead, togglePanel, openPanel} = useChatStore();

     const bottomRef = useRef<HTMLDivElement | null>(null);

    //  auto scroll on latest messages 

    useEffect(() => {
       if(isPanelOpen && bottomRef.current) {
          bottomRef.current.scrollIntoView({behavior : "smooth"});
       }
    }, [messages, isPanelOpen]);



    /// when panel is opened the messages goes to read 

    useEffect(() => {
       if(isPanelOpen) markRead();
    }, [isPanelOpen, markRead]);


    const sendMessage = useCallback((raw : string) => {
          
        const result = chatMessageSchema.safeParse({message : raw});

        if(!result.success) return;


        getSocket().emit("chat:send", {message : result.data.message});
    }, []);


    return {
       messages,
       unreadCount,
       isPanelOpen,
       bottomRef,
       sendMessage,
       togglePanel,
       openPanel,
    };
}





