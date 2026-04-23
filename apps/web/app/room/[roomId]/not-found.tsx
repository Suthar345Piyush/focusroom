// page if room not found 
// this not-found file is in between loading.tsx and page.tsx
 

import Link from "next/link";

export default function RoomNotFound() {
    return (

        <div className="min-h-dvh flex flex-col items-center justify-center gap-5 bg-bg-base px-6 text-center">
           
           <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center">

         <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--text-muted)" strokeWidth="1.3" strokeLinecap="round">
           <circle cx="14" cy="14" r="11"/>
        <path d="M14 9v6M14 18.5v.5"/>
        </svg>

           </div>


           <div>
             <h1 className="font-display text-2xl font-semibold text-text-primary mb-1">Room not found</h1>

             <p className="text-text-muted text-sm">This room doesn't exist or has already closed.</p>
           </div>

           <Link href="/dashboard" className="btn-primary">
             ⬅ Back to dashboard
           </Link>
           
        </div> 


    )
}