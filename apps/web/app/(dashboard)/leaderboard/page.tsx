// leaderboard page with all participants 

'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {motion} from "framer-motion";
import { useApi } from "@/lib/api";
import type { LeaderboardEntry } from "@/types/user.types";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Avatar } from "@/components/ui/avatar";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import { toast } from "@/components/ui/toast";



export default function LeaderboardPage() {
    
  const {user: clerkUser} = useUser();

  const {withToken, api} = useApi();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);


   useEffect(() => {

      async function load() {
          try{
             const data = await withToken((t) => api.rooms.leaderboard.global(t, 50));
             setEntries(data);
          } catch {
              toast.error("Could not load leaderboard");
          } finally {
              setIsLoading(false);
          }
      }

      load();
  } , []);




  const top3 = entries.slice(0, 3);


  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const podiumHeights = [top3[1] ? 72 : 0, 96, top3[2] ? 56 : 0];



  return (
 
       <div className="flex flex-col gap-10 animate-fade-up">

         <div>

           <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-1">Leaderboard</p>
           <p className="text-text-secondary mt-1">The last focused one standing earns their palce here.</p>

         </div>



         







       </div>

     
  )








   
}