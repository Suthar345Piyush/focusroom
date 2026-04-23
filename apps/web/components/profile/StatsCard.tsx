// displaying user stats ---------


'use client';


import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


interface Stat {
   label : string;
   value : string | number;
   icon : React.ReactNode;
   accent? : boolean;
}


interface StatsCardProps {
    stats : Stat[];
}


export function StatusCard({stats} : StatsCardProps) {
    
   return (

       <div className="grid grid-cols-2 gap-3">
         
          {stats.map((stat, idx) => (
                  
                   <motion.div key={stat.label} initial={{opacity : 0, y  : 8}} animate={{opacity : 1, y : 0}} transition={{duration : 0.3, delay : idx * 0.07, ease : [0.16, 1, 0.3, 1]}} className={cn("card flex flex-col gap-3 p-4", stat.accent && "border-accent/30 bg-accent-dim")}>


                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.accent ? "bg-accent/20 text-text-accent" : "bg-bg-elevated text-text-muted")}>

                       {stat.icon}
                       
                    </div>

                    <div className="flex flex-col gap-0.5">
                       
                       <span className={cn("font-display text-2xl font-bold", stat.accent ? "text-text-accent" : "text-text-primary")}>
                        {stat.value}
                       </span>

                       <span className="font-mono text-[11px] text-text-muted uppercase tracking-wider">{stat.label}</span>




                    </div>









                   </motion.div>


          ))}

       </div>

   )



}