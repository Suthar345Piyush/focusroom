// input UI code  

'use client';

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
}


export const Input = forwardRef<HTMLInputElement, InputProps> (
     ({label, error, hint, icon, className, id, ...props}, ref) => {
       
       const inputId = id ?? label?.toLowerCase().replace(/\s+/g,"-");

       return (

         <div className="flex flex-col gap-1.5">

           {label && (

             <label htmlFor={inputId} className="label">
              {label}
             </label>
           )}

           <div className="relative">

            {icon && (

               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                {icon}
               </span>

            )}

            <input ref={ref} id={inputId} className={cn("input", icon && "pl-9", error && "border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239, 68, 68,0,0.15)]", className)} aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined} aria-invalid={!!error} {...props} />
 
           </div> 


           {/* error  */}

           {error && ( 
             <p className="text-red-400 text-xs font-mono mt-0.5" id={`${inputId}-error`}>
               {error}
             </p>
           )}

           {/* hint  */}


           {hint && !error && ( 
             <p className="text-text-muted text-xs  mt-0.5" id={`${inputId}-hint`}>
               {hint}
             </p>
           )}
         </div>
       )
     }
);


Input.displayName = "Input";


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label? : string;
    error? : string;
    hint? : string;
}



export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps> (
     ({label, error, hint, className, id, ...props}, ref) => {
       
      
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g,"-");


        return (
            <div className="flex flex-col gap-1.5">

               {label && <label className="label" htmlFor={inputId}>{label}</label>}

               <textarea ref={ref} id={inputId} className={cn("input resize-none min-h-20", error && "border-red-500/60 focus:border-red-500", className)} {...props} />

               {error && <p className="text-red-400 text-xs font-mono mt-0.5">{error}</p>}
               {hint && !error && <p className="text-text-muted text-xs mt-0.5">{hint}</p>}


            </div>            
        )
     }
);

Textarea.displayName = "Textarea";

