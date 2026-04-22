// grid structure contains all users in the rooms

'use client';

import { AnimatePresence } from "framer-motion";
import { useRoomStore } from "@/stores/roomStore";
import { UserCard } from "./UserCard";


export function UserGrid() {

   const users = useRoomStore((s) => s.users);
   const currentUserId = useRoomStore((s) => s.currentUserId);
   const room = useRoomStore((s) => s.room);


  //  every user itself in the first grid box and  other users according to their status order (active -> idle -> inactive)  


  const sorted = [...users].sort((a, b) => {

       if(a.id === currentUserId) return -1;
       if(b.id === currentUserId) return 1;

       const order = {active : 0, idle : 1, inactive : 2};

       return (order[a.status] - order[b.status]) || a.joinedAt.localeCompare(b.joinedAt);

  });


  // if some empty slots 

  const emptySlots = room ? Math.max(0, room.maxUsers - users.length) : 0;

  return (
       
     <div className="flex flex-col gap-3">

       {/* header part  */}
       
        <div className="flex items-center justify-between">
           <h2 className="font-display text-sm font-semibold text-text-primary">
            Participants
           </h2>

           <div className="flex items-center gap-4 font-mono text-[10px] text-text-muted">

             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-status-active"/>
                {users.filter((u) => u.status === "active").length} active 
             </span>

             
             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-status-active"/>
                {users.filter((u) => u.status === "idle").length} idle 
             </span>
           </div>
        </div>


        {/* grid design structure  */}


        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">

           <AnimatePresence mode="popLayout">

            {sorted.map((user, idx) => (

                <UserCard  key={user.id} user={user} isMe={user.id === currentUserId} index={idx}/>

            ))}
            
           </AnimatePresence>


           {/* empty slots  */}

           {Array.from({length : emptySlots}).map((_, idx) => (

             <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border/40 min-h-35" key={`empty-${idx}`}>


               <div className="w-10 h-10 rounded-full border border-dashed border-border flex items-center justify-center">

            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="8" cy="5.5" r="2.5"/>
                <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
              </svg>

                </div>

                <span className="font-mono text-[10px] text-text-muted">Empty</span>

               </div>

           ))}
        </div>
     </div>

  );
}