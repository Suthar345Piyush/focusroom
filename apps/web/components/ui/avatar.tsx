// avatar component 


'use client';

import Image from "next/image";;
import {cn, getInitials} from "@/lib/utils";
import type { UserStatus } from "@/types/user.types";


type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";


const sizeMap : Record<AvatarSize, {px : number; class : string; dot : string}> = {
   xs : {px : 24, class : "w-6 h-6 text-[9px]", dot : "w-2 h-2 border"},
   sm: { px: 32, class: "w-8 h-8 text-xs",      dot: "w-2.5 h-2.5 border" },
   md: { px: 40, class: "w-10 h-10 text-sm",    dot: "w-3 h-3 border-[1.5px]" },
   lg: { px: 56, class: "w-14 h-14 text-base",  dot: "w-3.5 h-3.5 border-2" },
   xl: { px: 80, class: "w-20 h-20 text-xl",    dot: "w-4 h-4 border-2" },
};



const statusDotColor: Record<UserStatus, string> = {
      active : "bg-status-active shadow-[0_0_6px_var(--status-active)]",
      idle : "bg-status-idle",
      inactive : "bg-status-inactive",
};



interface AvatarProps {
   src?: string | null;
   name: string;
   size?: AvatarSize;
   status?: UserStatus;
   className?: string;
}



export function Avatar({src, name, size = "md", status, className} : AvatarProps) {

    const {px, class : sizeClass, dot: dotClass} = sizeMap[size];

    return (
       <div className={cn("relative inline-flex shrink-0", className)}>

        <div className={cn("rounded-full overflow-hidden flex items-center justify-center", "bg-bg-elevated border border-border font-display font-semibold text-text-accent", sizeClass)}>


          {src ? (
             <Image src={src} alt={name} width={px} height={px} className="object-cover w-full h-full"/>
          ) : (
             <span>{getInitials(name)}</span>
          )}
        </div>

        {status && (
           <span className={cn("absolute bottom-0 right-0 rounded-full border-bg-base", dotClass, statusDotColor[status])} aria-label={`Status: ${status}`}/>
        )}

       </div>
    );
}




