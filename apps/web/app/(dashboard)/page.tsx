// (dashboard)/page.tsx - to create room and active room view 

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { CreateRoomForm } from "@/components/dashboard/CreateRoomForm";

import { ActiveRoomCard } from "@/components/dashboard/ActiveRoomCard";


export const metadata : Metadata = {title : "Dashboard"};


export default async function DashboardPage() {
    
    const {userId} = await auth();



    return (
        <div className="flex flex-col gap-10 animate-fade-up">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs text-text-muted tracking-widest uppercase">Dashboard</p>

            <h1 className="text-3xl font-semibold text-text-primary">
              Focus Room
            </h1>

            <p className="text-text-secondary mt-1">Create a room, invite your team, and work in sync</p>
          </div>


          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">

            <div className="card-elevated p-6 flex flex-col gap-5 sticky top-0">
              <div className="flex flex-col gap-1">

                 <h2 className="font-display text-base font-semibold text-text-primary">
                  New room
                 </h2>
                 <p>Configure your session and share the invite link.</p>
              </div>

              <hr className="divider"/>

              {/* room form  */}
              <CreateRoomForm />

            </div>


            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <h2 className="font-display text-base font-semibold text-text-primary">
                  Active rooms
                 </h2>

                 <span className="font-mono text-xs text-text-muted">
                   - live sessions
                 </span>
              </div>


              {/* will replace with real time data soon  */}

              <EmptyRooms />
            </div>
          </div> 
        </div>
    );
}



// empty room 
function EmptyRooms() {
    return (
         
       <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border-dashed border-border text-center">
         
         <div className="w-12 h-12 rounded-xl bg-bg-elavated flex items-center justify-center">

         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"  strokeLinecap="round">

            <circle cx="12" cy="12" r="9"/>
             <path d="M12 7v5l3 3"/>

        </svg>

         </div>

         <p className="text-text-muted text-sm">No active rooms right now</p>
         <p className="text-text-muted text-xs font-mono">Create one to get started</p>

       </div>
       
    );
}

