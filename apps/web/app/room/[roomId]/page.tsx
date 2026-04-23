// main room view shown page

'use client';


import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSocket } from "@/hooks/useSocket";
import { usePresence } from "@/hooks/usePresence";
import { useRoomStore } from "@/stores/roomStore";
import { useChatStore } from "@/stores/chatStore";
import { RoomHeader } from "@/components/room/RoomHeader";
import { PomodoroTimer } from "@/components/room/PomodoroTimer";
import { UserGrid } from "@/components/room/UserGrid";
import { ChatPanel } from "@/components/room/ChatPanel";
import { KickCountdown } from "@/components/room/KickCountdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoom } from "@/hooks/useRoom";



// room page   


export default function RoomPage() {
    
    const {roomId} = useParams<{roomId : string}>();
    const router = useRouter();
    const {isSignedIn, isLoaded} = useAuth();
    const {isConnected, isConnecting} = useSocket();
    const {leaveRoom} = useRoom(roomId);

    const room = useRoomStore((r) => r.room);

    const {isPanelOpen, togglePanel, unreadCount} = useChatStore();


    // after 120 seconds of inactivity, then user will be kicked out  

    usePresence(room?.kickAfterSecs ?? 120);

    // authentication layer 

    useEffect(() => {
       
        if(isLoaded && !isSignedIn) {
           router.replace(`/sign-in?redirect_url=/room/${roomId}`);
        }

    }, [roomId, isSignedIn, isLoaded, router]);


    if(!isLoaded || isConnecting) {
       return <LoadingScreen label={isConnecting ? "Connecting..." : "Loading..."}/>
    }



    if(!isConnected) {
       return (
          <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-bg-base">
             <p className="text-text-secondary">Could not connect to server.</p>
             <Button variant="ghost" onClick={() => window.location.reload()}>
               Retry 
             </Button>
          </div>
       );
    }


    if(!room) {
       return <LoadingScreen label="Joining room..."/>;
    }



    return (
         
       <div className="flex flex-col h-dvh bg-bg-base overflow-hidden">

           <KickCountdown />

           <RoomHeader onLeave={leaveRoom}/>


           <div className="flex flex-1 overflow-hidden">

             <div className="flex-1 flex flex-col xl:flex-row overflow-y-auto">


               <div className="flex flex-col items-center justify-start xl:justify-center gap-8 px-8 py-10 xl:w-80 xl:shrink-0 xl:border-r xl:border-border">

                <PomodoroTimer />

                {room && (

                  <div className="flex items-center gap-6 font-mono text-[11px] text-text-muted">

                     <span title="Focus duration">⏰ {room.pomodoroMinutes}m</span>
                     <span title="Break">🍵 {room.breakMinutes}m</span>
                     <span title="Kick limit">⚡{Math.floor(room.kickAfterSecs / 60)}m idle</span>
                    </div>
                )}
               </div>


               {/* user grid  */}

               <div className="flex-1 px-6 py-8 overflow-y-auto">
                <UserGrid />
               </div>
             </div>


             {/* chat panel  */}

             <div className="flex">

              {!isPanelOpen && (

                 <button onClick={togglePanel} className={cn("flex flex-col items-center justify-center gap-1", "w-10 border-l border-border bg-bg-surface", "text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors")} aria-label="Open chat">

              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                 <path d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h4l2 2 2-2h4a1 1 0 001-1V3a1 1 0 00-1-1z"/>
              </svg>

              {unreadCount > 0 && (

                  <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold items-center justify-center">
                     {unreadCount > 9 ? "9+" : unreadCount}
                  </span>

              )}

                 </button>
              )}

              <ChatPanel />

             </div>
           </div>
       </div>
    );
}



//  loading screen 


function LoadingScreen({label} : {label : string}) {
    
    return (
       <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-bg-base">

         <div className="relative w-12 h-12">
         <svg className="animate-spin text-accent" viewBox="0 0 48 48" fill="none">

            <circle cx="24" cy="24" r="20" stroke="var(--border)" strokeWidth="4"/>
            <path d="M24 4a20 20 0 0118.4 12" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"/>
        </svg>

         </div>
         <p className="font-mono text-sm text-text-muted">{label}</p>
       </div>
    );
}





