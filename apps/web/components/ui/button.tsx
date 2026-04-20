// button ui component 

'use client';

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";


type Variant = "primary" | "ghost" | "danger" | "amber";
type Size = "sm" | "md" | "lg";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: Variant;
     size?: Size;
     loading?: boolean;
     icon?: React.ReactNode;
}


const variantClasses : Record<Variant, string> = {
    primary : "btn-primary",
    ghost : "btn-ghost",
    danger : "btn-danger",
    amber : [
        "inline-flex items-center justify-center gap-2",
        "px-5 py-2.5 rounded-md border cursor-pointer transition-all duration-150",
        "bg-amber-dim border-amber/30 text-amber font-display text-sm font-medium",
        "hover:bg-amber/20 hover:border-amber/50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
    ].join(" "),
};



const sizeClasses: Record<Size, string> = {
    sm : "!px-3 !py-1.5 !text-xs !gap-1.5",
    md : "",
    lg : "!px-6 !py-3 !text-base",
};


export const Button = forwardRef<HTMLButtonElement, ButtonProps>(

   ({variant = "primary", size = "md", loading, icon, children, className, disabled, ...props}, ref) => {
      
    return (

       <button ref={ref} className={cn(variantClasses[variant], sizeClasses[size], className)} disabled={disabled || loading} {...props}>


        {loading ? <Spinner /> : icon}
        {children}
       </button>
      
    );
   }
);


Button.displayName = "Button";


function Spinner() {
   return (
      <svg className="animate-pulse" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">

        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round"/>
         
      </svg>
   );
}












