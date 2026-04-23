// rank table for all users 

'use client';

import {motion} from "framer-motion";
import type { LeaderboardEntry } from "@/types/user.types";
import { Avatar } from "../ui/avatar";
import {RankBadge} from "./RankBadge";
import { cn } from "@/lib/utils";


interface LeaderboardTableProps {
 entries : LeaderboardEntry[];
 currentUserId? : string; 
 }



 export function LeaderboardTable({entries, currentUserId} : LeaderboardTableProps) {
    
    if(entries.length === 0) {
        
      return (

          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center">

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)"    strokeWidth="1.3" strokeLinecap="round">
               <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/>
          </svg>

        </div>

        <p className="text-text-muted text-sm">No entries yet</p>
        <p className="text-text-muted text-xs font-mono">Complete a room to appear here</p>
             
          </div>
      );
    }



    return (

      <div className="flex flex-col gap-1">

         <div className="grid grid-cols-[48px_1fr_100px_80px] gap-4 px-4 py-2">

          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Rank</span>
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">User</span>
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider text-right">Room won</span>
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider text-right">Score</span>

         </div>


         <hr className="divider"/>
     

       {/* rows   */}

       <div className="flex flex-col gap-1 mt-1">
         
          {entries.map((entry, idx) => {


              const  isMe = entry.user.id === currentUserId;
              const isTop3 = entry.rank <= 3;


              return (
                 
                 <motion.div initial={{opacity : 0, x : -10}} animate={{opacity : 1, x : 0}} transition={{duration : 0.3, delay : idx * 0.04, ease :[0.16, 1, 0.3, 1]}} key={entry.id} className={cn("grid grid-cols-[48px_1fr_100px_80px] gap-4 items-center", "px-5 py-3 rounded-xl border transition-colors duration-200",  isMe ? "border-accent/30 bg-accent-dim" : isTop3 ? "border-border-light bg-bg-elevated" : "border-transparent bg-transparent hover:bg-bg-surface hover:border-border")}>


                  <div className="flex items-center">
                    <RankBadge rank={entry.rank}/>
                  </div>


                  <div className="flex items-center gap-3 min-w-0">

                     <Avatar src={entry.user.avatarUrl} name={entry.user.displayName} size="sm"/>

                     <div className="flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5">
                         
                         <span className={cn("font-display font-medium text-sm truncate", isMe ? "text-text-accent" : "text-text-primary")}>

                          {entry.user.displayName}

                         </span>


                         {isMe && (

                              <span className="font-mono text-[10px] text-text-muted shrink-0">
                                (you)
                              </span>

                         )}

                       </div>

                       <span className="font-mono text-[10px] text-text-muted truncate">@{entry.user.username}</span>

                     </div>

                  </div>



                  {/* rooms won */}

                  <div className="text-right">

                     <span className={cn("font-display font-semibold text-sm tabular-nums", isTop3 ? "text-text-primary" : "text-text-secondary")}>

                       {entry.user.roomsWon}

                     </span>

                  </div>


                  <div className="text-right">
                     <span className={cn("font-mono text-sm tabular-nums font-medium", isMe ? "text-text-accent" : isTop3 ? "text-medium" : "text-text-muted")}>

                      {entry.score.toLocaleString()}
                     </span>
                  </div>


                 </motion.div>
              
              )
          })}
       </div>

      </div>
 
    );
 }

 



