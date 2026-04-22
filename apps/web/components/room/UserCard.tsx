// user card contains the small amount of user info like - name , avatar and status  

'use client';

import {motion} from "framer-motion";
import type { RoomUser } from "@/types/user.types";
import { Avatar } from "../ui/avatar";
import { StatusBadge } from "../ui/badge";
import { cn, timeAgo } from "@/lib/utils";


interface UserCardProps {
   user: RoomUser;
   isMe : boolean;
   index? : number;
}



export function UserCard({user, isMe, index = 0} : UserCardProps) {
    
  return (

     <motion.div initial={{opacity : 0, scale : 0.95}} layout animate={{opacity : 1, scale : 1}} exit={{opacity : 0, scale : 0.9}} transition={{duration : 0.25, delay : index * 0.04, ease : [0.16, 1, 0.3, 1]}} className={cn("flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors duration-300", 


     user.status === "active" ? "border-border bg-bg-surface hover:border-border-light" : user.status === "idle" ? "border-amber/20 bg-amber/5" : "border-border/50 bg-bg-base opacity-60" 
     )}>


      {/* status  */}

      <div className={cn("p-0.5 rounded-full", user.status === "active"  && "ring-1 ring-status-active/50", user.status === "idle" && "ring-1 ring-status-idle/50")}>

        <Avatar src={user.avatarUrl} name={user.displayName} size="lg" status={user.status}/>

      </div>



      {/* name of the user  */}

      <div className="flex flex-col items-center gap-0.5 w-full min-w-0">

        <div className="flex items-center gap-1.5">

           <span className="font-display font-medium text-sm text-text-primary truncate max-w-22.5">
             {user.displayName}
           </span>


           {isMe && (
              <span className="font-mono text-[10px] text-text-muted">(you)</span>
           )}

           {user.isHost && (
             <span title="Host" className="text-amber text-xs">★</span>
           )} 
           
        </div>

        <span className="font-mono text-[10px] text-text-muted truncate max-w-22.5">
           @{user.username}
        </span>
      </div>

      {/* badge  */}

      <StatusBadge status={user.status}/>

      {/* last active  */}

      {user.status !== "active" && (
         <span className="font-mono text-[10px] text-text-muted">
            {timeAgo(user.lastActiveAt)}
         </span>
      )}




       
     </motion.div> 
     

  )



}