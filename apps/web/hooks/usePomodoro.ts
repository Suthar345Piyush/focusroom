// use pomodoro hook related to the timer sync, sync from server  

'use client';

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useTimerStore } from "@/stores/timerStore";
import { useRoomStore, selectIsHost } from "@/stores/roomStore";


export function usePomodoro() {
   
    const {isRunning, remainingSeconds, phase, round, tick} = useTimerStore();
    const isHost = useRoomStore(selectIsHost);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


    // tick 

    useEffect(() => {

          if (isRunning) {
              intervalRef.current = setInterval(() => tick(), 1000);
          }  else {
               if(intervalRef.current) clearInterval(intervalRef.current);
          }

          return () => {
             if(intervalRef.current) clearInterval(intervalRef.current);
          };
    }, [isRunning, tick]);



    // controls host have  
    
    function start(){
       if(!isHost) return;
       getSocket().emit("timer:start");
    }


    function pause(){
      if(!isHost) return;
      getSocket().emit("timer:pause");
    }


    function reset(){
       if(!isHost) return;
       getSocket().emit("timer:reset");
    }

    return {
       isRunning,
       remainingSeconds,
       phase,
       round,
       isHost,
       start,
       pause,
       reset,
    };
};


