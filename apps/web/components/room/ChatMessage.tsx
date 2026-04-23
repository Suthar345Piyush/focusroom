// single container for a single message from user 


'use client';

import {motion} from "framer-motion";
import type { ChatMessage as ChatMessageType } from "@/types/socket.types";
import { Avatar } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";


interface ChatMessageProps {
    message : ChatMessageType;
    isMe : boolean;
    showAvatar : boolean;
}


export function ChatMessage({message, isMe, showAvatar} : ChatMessageProps)  {
    
    return (

       <motion.div initial={{opacity : 0, y : 6}} animate={{opacity : 1, y : 6}} transition={{duration : 0.2}} className={cn("flex items-end gap-2" , isMe ? "flex-row-reverse" : "flex-row")}>


        {/* avatar shown when sender changes  */}


        <div className="w-6 shrink-0">

           {showAvatar && !isMe && (
               <Avatar src={message.avatarUrl} name={message.displayName} size="xs"/>
           )}
           
        </div>



        {/* bubble animation when user is typing   */}


        <div className={cn("flex flex-col gap-0.5 max-w-[75%]", isMe && "items-end")}>

           {showAvatar && !isMe && (

              <span className="font-mono text-[10px] text-text-muted px-1">
                 {message.displayName}
              </span>
           )}

           <div className={cn("px-3 py-2 rounded-2xl text-sm leading-snug wrap-break-word", isMe ? "bg-accent text-white rounded-br-sm" : "bg-bg-elavated border border-border text-text-primary rounded-bl-sm")}>

            {message.message}

           </div>

           <span className="font-mono text-[9px] text-text-muted px-1">{timeAgo(message.sentAt)}</span>
        </div>
       </motion.div> 
    );
}






