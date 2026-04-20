// use presence hook for user tracking and user status  

'use client';

import { useEffect, useCallback, useRef} from "react";
import { getSocket } from "@/lib/socket";
import { useRoomStore } from "@/stores/roomStore";
import type { UserStatus } from "@/types/user.types";


const IDLE_AFTER_MS = 30_000;   // after 30 seconds unactive -> idle     
const PING_INTERVAL_MS = 10_000;     // ping after every 10s 


export  function usePresence(kickAfterSecs : number) {
     
    const {currentUserId} = useRoomStore();

    const lastActivityRef = useRef(Date.now());

    const statusRef = useRef<UserStatus>("active");

    const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const emitStatus = useCallback((status : UserStatus) => {

        if(statusRef.current === status) return;

        statusRef.current = status;

        getSocket().emit("presence:set", {status});
    }, []);


    const resetActivity  = useCallback(() => {
        lastActivityRef.current = Date.now();

        emitStatus("active");

        // reseting the timer 

        if(idleRef.current) clearTimeout(idleRef.current);

        idleRef.current = setTimeout(() => {
           emitStatus("idle");
        }, IDLE_AFTER_MS);
    }, [emitStatus]);




    useEffect(() => {

       if(!currentUserId) return;


       const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];

       events.forEach((e) => window.addEventListener(e, resetActivity, {passive : true}));


       // PING 

       pingRef.current = setInterval(() => {
         getSocket().emit("presence:ping");
       }, PING_INTERVAL_MS);


       // kick out waring  

       const socket = getSocket();

       socket.on("kick-warning", ({secondsLeft}) => {
          console.info(`[presence] kick warning: ${secondsLeft}s reamining`);
       });



       // iniital activity  

       resetActivity();


       return () => {
          events.forEach((e) => window.removeEventListener(e, resetActivity));
          if( pingRef.current ) clearInterval(pingRef.current);
          if(idleRef.current) clearTimeout(idleRef.current);
          
          socket.off("kick-warning");
       };
    }, [currentUserId, kickAfterSecs, resetActivity]);
}


