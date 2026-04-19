// helper utility functions to use in whole app 

import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import type { UserStatus } from "@/types/user.types";


// merging tailwind classes 

export function cn(...inputs : ClassValue[]) {
   return twMerge(clsx(inputs));
}


// timer seconds format mm:ss

export function formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


// human - readable format (2m 30s)

export function formatDuration(seconds: number) : string {
     if (seconds < 60) return `${seconds}`;

     const m = Math.floor(seconds / 60);
     const s = seconds % 60;

     return s > 0 ? `${m}m ${s}s` : `${m}m`;
}


// time ago format 

export function timeAgo(dateStr: string): string {

      const diff = Date.now() - new Date(dateStr).getTime();

      const s = Math.floor(diff/1000);
      if(s < 60) return `${s}s ago`;

      const m = Math.floor(s / 60);
      if(m < 60) return `${m}m ago`;

      const h = Math.floor(m / 60);
      if(h < 60) return `${h}h ago`;


      return `${Math.floor(h / 24)}d ago`;
}


// user status 

export function statusLabel(status: UserStatus) : string {
    return {active : "Active", idle : "Idle", inactive: "Away"}[status];
}


// tailwind styles for the user status  

export function statusColor(status : UserStatus) : string {
     return {
       active : "text-status-active",
       idle : "text-status-idle",
       inactive : "text-status-inactive",
     }[status];
}

// profile avatar 

export function getInitials(name: string) : string {
   return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}


// copy to clipboard  (text)

export async function copyToClipboard(text : string) : Promise<boolean> {
    try {
       await navigator.clipboard.writeText(text);
       return true;
    }

    catch {
       return false;
    }
}











 

