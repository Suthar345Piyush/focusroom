// copy to clipboard invite link component 

'use client';

import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";


interface InviteLinkProps {
   inviteCode : string;
}


export function InviteLink({inviteCode} : InviteLinkProps) {
    
  const [copied, setCopied] = useState(false);


  const url = typeof window !== "undefined" ? `${window.location.origin}/room/join/${inviteCode}` : `/room/join/${inviteCode}`;


  // url copy function 

  async function handleCopy() {

      const ok = await copyToClipboard(url);

      if(ok) {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      }
  }



  return (

       <button onClick={handleCopy} className={cn("group flex items-center gap-2 px-3 py-1.5 rounded-lg border  transition-all duration-200", "font-mono text-xs", copied ? "border-status-active/40 bg-emerald-500/10 text-status-active" : "border-border bg-bg-elevated text-text-muted hover:border-border-light hover:text-text-primary")} title="Copy invite link">


        {copied ? (

            <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1.5 6l3 3 6-6"/>
          </svg>
             Copied!
            </>

        ) : (

           <>  
           <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"   strokeLinecap="round">
             <rect x="4" y="4" width="7" height="7" rx="1.5"/>
            <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1"/>
            </svg>
         {inviteCode}
            
           </>
        )}
       </button>
  );
}


