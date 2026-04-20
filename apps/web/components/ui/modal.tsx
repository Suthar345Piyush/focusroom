// modal component 

'use client';

import { useEffect, useRef } from "react";
import {motion, AnimatePresence} from "framer-motion";
import {cn} from "@/lib/utils";



interface ModalProps {
    open: boolean;
    onClose : () => void;
    title? : string;
    description?: string;
    children : React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
}


const sizeMap = {
   sm : "max-w-sm",
   md : "max-w-md",
   lg : "max-w-lg",
};



export function Modal({open, onClose, title, description, children, className, size = "md"} : ModalProps) {
    
    const panelRef = useRef<HTMLDivElement>(null);

    // closing the modal when we click outside the modal (escape)

    useEffect(() => {

       if(!open) return;


       const handler = (e : KeyboardEvent) => {
         if(e.key === "Escape") onClose();
       };


       document.addEventListener("keydown", handler);

       return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    

    // locking scroll 

    useEffect(() => {
       document.body.style.overflow = open ? "hidden" : "";
       return () => {document.body.style.overflow = ""};
    }, [open]);



    return (
        <AnimatePresence>
          {open && (

             <div className="fixed inset-0 x-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby={title ? "modal-title" : undefined}>

              <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{opacity : 0}} animate={{opacity : 1}} exit={{opacity : 0}} transition={{duration : 0.2}} onClick={onClose}/>



              {/* panel  */}

              <motion.div ref={panelRef} className={cn("relative w-full card-elevated z-10", "p-6 flex flex-col gap-4", sizeMap[size], className)}  initial={{opacity : 0, y : 16, scale : 0.97}} animate={{opacity : 1, y : 0, scale : 1}} exit={{opacity : 0, y : 8, scale : 0.98}} transition={{duration : 0.22, ease:[0.16, 1, 0.3, 1]}}>


                {/* close button  */}

           <button onClick={onClose} className={cn("absolute top-4 right-4 w-7 h-7 rounded-md", "flex        items-center justify-center", "text-text-muted hover:text-text-primary hover:bg-bg-hover", "transition-all duration-150")} aria-label="Close">

                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
          </button>


          {(title || description) && (
             <div className="flex flex-col gap-1 pr-6">

              {title && (
                 <h2 id="modal-title" className="font-display text-lg font-semibold text-text-primary">
                  {title}
                 </h2>
              )}

              {description && (
                 <p className="text-text-secondary text-sm">{description}</p>
              )}

             </div>
          )}
              </motion.div>
             </div>
          )}
        </AnimatePresence>
    );
}

