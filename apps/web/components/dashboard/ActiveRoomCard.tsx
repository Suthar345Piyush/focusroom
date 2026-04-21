// room card - active component , like which rooms are active, shows on dashboard 

'use client';

import { useRouter } from "next/navigation";
import {motion} from "framer-motion";
import type { Room } from "@/types/room.types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDuration } from "@/lib/utils";


interface ActiveRoomCardProps {
   room: Room;
   participantCount : number;
   index?: number;
}


export function ActiveRoomCard({room, participantCount, index = 0}: ActiveRoomCardProps) {
    
   const router = useRouter();
   const isFull = participantCount >= room.maxUsers;


   return (

       <motion.div initial={{opacity : 0, y : 10}} animate={{opacity : 1, y : 0}} transition={{duration : 0.3, delay : index * 0.06, ease : [0.16, 1, 0.3, 1]}} className="card p-5 flex flex-col gap-4 hover:border-border-light transition-colors duration-200 group">


        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">

             <h3 className="font-display font-semibold text-text-primary truncate">
               {room.name}
             </h3>

             <div className="flex items-center gap-2 flex-wrap">

               <Badge variant={room.status === "ACTIVE" ? "success" : "accent"}>
                 {room.status === "ACTIVE" ? "Live" : "Waiting"}
               </Badge>


               <span className="font-mono text-xs text-text-muted">
                 {participantCount}/{room.maxUsers} users
               </span>

             </div>

          </div>

          <div className="flex items-center gap-1 shrink-0">

            {Array.from({length : room.maxUsers}).map((_, i) => (
               <span key={i} className={`w-1.5 h-4 rounded-full transition-colors ${
                  i < participantCount ? "bg-status-active" : "bg-border"
               }`} />
            ))}

          </div>

        </div>

        {/* some extra info about the room  */}

        <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
          <span title="Focus duration">⏰{room.pomodoroMinutes}m</span>
          <span title="Break duration">🍵{room.breakMinutes}m</span>
          <span title="Idle kick limit">⚡kick after {formatDuration(room.kickAfterSecs)}</span>
        </div>


        {/* join button to join the room  */}

        <Button variant={isFull ? "ghost" : "primary"} size="sm" disabled={isFull} className="self-start" onClick={() => router.push(`/room/${room.id}`)}>

           {isFull ? "Room full" : "Join room ➡️"}

        </Button>









       </motion.div>
   )


}