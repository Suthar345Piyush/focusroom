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


  function handleKeyDown(e : KeyboardEvent<HTMLInputElement>) {
      if(e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
  }


  return (

     <div className={cn("flex flex-col border border-border bg-bg-surface transition-all duration-300", isPanelOpen ? "w-72 flex shrink-0" : "w-0 overflow-hidden")}>


       <AnimatePresence>

         {isPanelOpen && (

             <motion.div initial={{opacity : 0}} animate={{opacity : 1}} exit={{opacity : 0}} transition={{duration : 0.2}} className="flex flex-col h-full min-w-[288px]">

              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">

                 <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h4l2 2 2-2h4a1 1 0 001-1V3a1 1 0 00-1-1z"/>
                </svg>

                <span className="font-display text-sm font-medium text-text-primary">Chat</span>

                <span className="font-mono text-[10px] text-text-muted">
                  {messages.length}
                </span>

                 </div>


                 <button onClick={togglePanel} className="text-text-muted hover:text-primary transition-colors" aria-label="Close Chat">

                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10 4L4 10M4 4l6 6"/>
                </svg>

                 </button>
              </div>


              {/* messages area  */}

              <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2 min-h-0">


                {messages.length === 0 && (

              <div className="flex flex-col items-center justify-center h-full gap-2 text-center">

                   <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M24 4H4a2 2 0 00-2 2v13a2 2 0 002 2h7l3 4 3-4h7a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                  </svg>

                  {/*if their are no messages*/}

                  <p className="text-text-muted text-xs">No messages yet</p>
                  <p className="text-text-muted text-[10px] font-mono">Be the first to say hi</p>

              </div>
                )}

                {messages.map((msg, idx) => {

                   const prev = messages[idx- 1];

                   const showAvatar = !prev || prev.userId !== msg.userId;

                   return (

                     <ChatMessage key={msg.id} message={msg} isMe={msg.userId === currentUserId} showAvatar={showAvatar}/>

                   );
                })}

                <div ref={bottomRef}/>

              </div>

              {/* input place  */}

              <div className="flex items-center gap-2 p-3 border-t border-border shrink-0">

                 <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message everyone..." maxLength={500} className={cn("input flex-1 py-2 text-sm", "placeholder:text-text-muted")}/>

                 <button onClick={handleSend} disabled={!draft.trim()} className={cn("w-8 h-8 rounded-md flex items-center justify-center shink-0 transition-all duration-150", draft.trim() ? "bg-accent text-white hover:bg-accent/90" : "bg-bg-elavated text-text-muted cursor-not-allowed")} aria-label="Send Message">

                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                     <path d="M14 2L2 7l4 4 1 5 3-3 4 2-4-13z"/>
               </svg>
                </button>


              </div>

        </motion.div>
        )} 

    </AnimatePresence>
     
  </div> 
    
  );
}


