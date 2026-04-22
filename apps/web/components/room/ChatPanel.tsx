// message side panel  on the right side 

'use client';

import { useRef, useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { useRoomStore } from "@/stores/roomStore";
import { cn } from "@/lib/utils";
import  {ChatMessage} from "./ChatMessage";




export function ChatPanel() {
    
  const {messages, unreadCount, isPanelOpen, bottomRef, sendMessage, togglePanel} = useChat();

  const currentUserId = useRoomStore((s) => s.currentUserId);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);


  // function for sending messages 

  function handleSend() {

     const trimmed = draft.trim();

      if(!trimmed) return;

      sendMessage(trimmed);
      setDraft("");
      inputRef.current?.focus();
  }




  
   
}