// badge component 

import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/user.types";


type BadgeVariant = "default" | "accent" | "amber" | "success" | "danger" | "muted";

const variants : Record<BadgeVariant , string> = {
     default : "bg-bg-elevated border-border text-text-secondary",
     accent : "bg-accent-dim border-accent/30 text-text-accent",
     amber : "bg-amber-dim border-amber/30 text-amber",
     success : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
     danger : "bg-red-500/10 border-red-500/30 text-red-400",
     muted : "bg-transparent border-transparent text-text-muted",  
};



interface BadgeProps {
   children : React.ReactNode;
   variant? : BadgeVariant;
   className? : string;
}


export function Badge({children, variant = "default", className}: BadgeProps) {
      return (
          <span className={cn("tag border", variants[variant], className)}>
            {children}
          </span>
      );
}


// status badge  

// Record ->  UserStatus : BadgeVariant (active : success)

const statusVariant : Record<UserStatus, BadgeVariant> = {
   active : "success",
   idle : "amber",
   inactive : "muted",   
};


// for status text  

const StatusText : Record<UserStatus, string> = {
   active : "Active",
   idle : "Idle",
   inactive : "Away",
};




// final status badge  function 

export function StatusBadge({status} : {status : UserStatus}) {
     return (
         <Badge variant={statusVariant[status]}>

          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status === "active" && "bg-emerald-400", status === "idle"  && "bg-amber", status === "inactive" && "bg-text-muted")}>
             
          </span>

          {StatusText[status]}

         </Badge>
     )
}
 





