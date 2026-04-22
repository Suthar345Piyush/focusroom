// warning shown when any inactive user is going to be kicked out from room

'use client';


import { useState, useEffect } from "react";
import {motion, AnimatePresence} from "framer-motion";
import { getSocket } from "@/lib/socket";


export function KickCountdown() {

     const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

     useEffect(() => {

         const socket = getSocket();

         // having the socket and give warning and if user again become active, not give the warning  

         socket.on("kick-warning", ({secondsLeft}) => {
            setSecondsLeft(secondsLeft);
         });

         // if user becomes active again, then don't give the warning of kick out 
         //  updating the status of user to active again 

         socket.on("presence-update", ({status}) => {
            if(status === "active") setSecondsLeft(null);
         });


         // at the end kick out, if still inactive 

         return () => {
           socket.off("kick-warning");
         }

     }, []);


     // countdown tick timer 


     useEffect(() => {
           if(secondsLeft === null || secondsLeft < 0) return;

      const t = setTimeout(() => setSecondsLeft((s) => (s !== null ? s - 1 : null)), 1000);

      return () => clearTimeout(t);
     }, [secondsLeft]);

 
     return (

         <AnimatePresence>

           {secondsLeft !== null && secondsLeft > 0 && (

                <motion.div className="fixed top-20 left-1/2 -translate-x-1/2 z-50" initial={{opacity : 0, y : -12}} animate={{opacity : 1, y : 0}} exit={{opacity : 0, y : -12}} transition={{duration : 0.2}}>  

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-amber/30 bg-amber-dim shadow-[0_8px_32px_rgba(0, 0, 0, 0.5)] backdrop-blur-sm">

                   <span className="text-amber animate-pulse text-base">
                     ⚡
                   </span>

                   <div className="flex flex-col">
                     <p className="text-amber text-xs font-semibold font-display">Inactivity detected</p>

                     <p className="text-amber/70 text-[11px] font-mono">
                      Move or type to stay - kicked in {secondsLeft}s
                     </p>

                   </div>


                   {/* progress bar  */}
                   <div className="w-16 h-1 rounded-full bg-amber/70 overflow-hidden ml-1">
                   <motion.div animate={{width : "0%"}} initial={{width : "100%"}} transition={{duration : secondsLeft , ease : "linear"}} className="h-full bg-amber rounded-full">

                    </motion.div>
                   </div>
                </div>

                </motion.div>
           )}
         </AnimatePresence>
         
     )


} 