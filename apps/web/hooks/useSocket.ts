// useSocket hook to handle the socket connection and disconnection 

'use client';

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { initSocket, destroySocket, getSocket } from "@/lib/socket";
import type { AppSocket } from "@/lib/socket";


interface UseSocketReturn {
   socket : AppSocket | null;
   isConnected : boolean;
   isConnecting : boolean;
}




export function useSocket() : UseSocketReturn {

   const {getToken, isSignedIn} = useAuth();

   const [isConnected, setIsConnected] = useState(false);
   const [isConnecting, setIsConnecting] = useState(false);

   const socketRef = useRef<AppSocket | null>(null);

   useEffect(() => {

      if(!isSignedIn) return;

      let mounted = true;

      async function connect() {

         setIsConnecting(true);

         try {
            const token = await getToken();

            if(!token || !mounted) return;


            // init socket  

            const s = initSocket(token);

            socketRef.current = s;


            // using 's' for connection and disconnection 

            s.on("connect", () => {
                if(mounted) {
                   setIsConnected(true);
                   setIsConnecting(true);
                }
            });

            
            // disconnection 

            s.on("disconnect", () => {
              if(mounted) setIsConnecting(false);
            })
         } catch {
             if(mounted) setIsConnecting(false);
         }
      }


      connect();

      return () => {
         mounted = false;
      };

   }, [isSignedIn, getToken]);


   return {
       socket : socketRef.current,
       isConnected,
       isConnecting,
   };
}






