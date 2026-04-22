// room header contains invite link, user count ....

'use client';

import { useRoomStore } from "@/stores/roomStore";
import { InviteLink } from "./InviteLink";
import { Button } from "../ui/button";


interface RoomHeaderProps {
    onLeave : () => void;
}



export function RoomHeader({onLeave} : RoomHeaderProps) {
  
    const room = useRoomStore((r) => r.room);
    const users = useRoomStore((u) => u.users);

    if(!room) return null;


    return (
        
         <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-bg-surface/80 backdrop-blur-md sticky top-0 z-20">

            <div className="flex items-center gap-4 min-w-4">

              <div className="flex items-center gap-1.5 shrink-0">
                 <span  className="w-2 h-2 rounded-full bg-status-active animate-pulse-glow"/>

                 <span className="font-mono text-xs text-status-active">LIVE</span>

              </div>

              <div className="h-4 w-px bg-border shrink-0"/>

              <h1 className="font-display font-semibold text-text-primary truncate">{room.name}</h1>

              <div className="h-4 w-px bg-border shrink-0 hidden sm:block"/>


              <span className="font-mono text-xs text-text-muted hidden sm:block shrink-0">{users.length}/{room.maxUsers} in room</span>

             </div>

          {/* right side - (leave + invite link) */}

          <div className="flex items-center gap-2 shrink-0">

            <InviteLink inviteCode={room.inviteCode}/>

            <Button variant='danger' size="sm" onClick={onLeave}>

          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">

            <rect x="4" y="4" width="7" height="7" rx="1.5"/>

            <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1"/>

          </svg>

          Leave

            </Button>
          </div>
         </header>
    );
}

