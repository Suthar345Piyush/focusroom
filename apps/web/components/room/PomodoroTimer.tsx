// pomodoro timer with control of host  

'use client';

import {motion} from "framer-motion";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useRoomStore } from "@/stores/roomStore";
import { formatTime } from "@/lib/utils";
import { Button } from "../ui/button";


const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;


export function PomodoroTimer() {
      
   const {isRunning, remainingSeconds, phase, round, isHost, start, pause, reset} = usePomodoro();


   const room = useRoomStore((r) => r.room);

   if(!room) return null;

   const totalSeconds = phase === "focus" ? room.pomodoroMinutes * 60 : room.breakMinutes * 60;


   const progress = Math.max(0, remainingSeconds / totalSeconds);
   const dashOffset = CIRCUMFERENCE * (1 - progress);

   const isFocus = phase === "focus";
   const accentColor = isFocus ? "var(--accent)" : "var(--amber)";

   const glowColor = isFocus ? "rbga(99, 130, 255, 0.35)" : "rgba(245, 166, 35, 0.35)";


   return (
       
      <div className="flex flex-col items-center gap-6">

         <div className="flex items-center gap-6">

           {[1, 2, 3, 4].map((r) => (
               
                <span key={r} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${r <= round ? (isFocus ? "bg-accent" : "bg-amber") : "bg-border"}`} />
             
           ))}

           <span className="font-mono text-xs text-text-muted ml-1">Round {round}</span>

         </div>

         {/* timer circle  */}

         <div className="relative">
         <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">

          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />

          <motion.circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
            transition={{ duration: 0.8, ease: "linear" }}
          />
        </svg>


       <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rotate-0">
         
          <span className="font-mono text-[11px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border" style={{color : accentColor, borderColor : isFocus ? "rgba(99, 130, 255, 0.3)" : "rgba(245, 166, 35, 0.3" , background : isFocus ? "rgba(99, 130, 255, 0.08" : "rgba(245, 166, 35, 0.08"}}>


             {isFocus ? "Focus" : "Break"}

          </span>

          <span className="font-display text-4xl font-bold tabular-nums" style={{color : isRunning ? "var(--text-primary)" : "var(--text-secondary)", animation : isRunning ? undefined : "timer-pulse 2s ease-in-out infinite"}}>

            {formatTime(remainingSeconds)}

          </span>


          {!isRunning && (

             <span className="font-mono text-[10px] text-text-muted tracking-widest">
               PAUSED
             </span>
          )}
       </div>
    </div>


    {/* controls for host  */}

    {isHost && (

        <div className="flex items-center gap-2">

           <Button variant="ghost" size="sm" onClick={reset} title="Reset timer">

         <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 8a6 6 0 106-6H4M4 2L2 4l2 2"/>
            </svg>
            Reset
           </Button>

           <Button variant={isRunning ? "ghost" : "primary"} size="sm" onClick={isRunning ? pause : start}>

              {isRunning ? (

                   <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                   <rect x="1" y="1" width="3.5" height="10" rx="1"/>
                   <rect x="7.5" y="1" width="3.5" height="10" rx="1"/>
                </svg>
                  Pause
                   </>

              ) : (

                 <>
               <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 1.5l9 4.5-9 4.5V1.5z"/>
                </svg> 
                Start
                 </>

              )}
           </Button>

           </div>
    )}


    {!isHost && (
        <p className="font-mono text-xs text-text-muted">Host controls the timer</p>
    )}

      </div>
   );
}



