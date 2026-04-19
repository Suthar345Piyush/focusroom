// zustand store for chat 

import {create} from "zustand";
import type { ChatMessage } from "@/types/socket.types";

const MAX_MESSAGES = 200;


interface ChatStore {
   messages: ChatMessage[];
   unreadCount : number;
   isPanelOpen : boolean;
   addMessage : (msg : ChatMessage) => void;
   markRead : () => void;
   togglePanel : () => void;
   openPanel : () => void;
   clearMessage : () => void;
}


export const useChatStore = create<ChatStore>((set) => ({
   messages: [],
   unreadCount : 0,
   isPanelOpen : true,

   addMessage : (msg) => set((s) => ({
        messages: [...s.messages.slice(-(MAX_MESSAGES - 1)), msg],
        unreadCount : s.isPanelOpen ? 0 : s.unreadCount + 1,
   })),


   markRead : () => set({unreadCount : 0}),


   togglePanel : () => set((s) => ({
       isPanelOpen : !s.isPanelOpen,
       unreadCount : !s.isPanelOpen ? 0 : s.unreadCount,
   })),


   openPanel : () => set({isPanelOpen : true, unreadCount : 0}),

   clearMessage : () => set({messages : [], unreadCount : 0}),

}));






