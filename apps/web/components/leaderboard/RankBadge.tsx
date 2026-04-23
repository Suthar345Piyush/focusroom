// rank badge  for top 3 


import { cn } from "@/lib/utils";


const rankConfig : Record<number, {label : string; classes : string; glow : string}> = {
   
    1 : {
       label : "1st",
       classes : "bg-amber/20 border-amber/40 text-amber",
       glow : "shadow-[0_0_12px_rgba(245, 166, 35, 0.25)]",
    },

    2 : {
      label : "2nd",
      classes : "bg-[rgba(192,192,192,0.15)] border-[rgba(192,192,192,0.35)] text-[#c0c0c0]",
      glow : "shadow-[0_0_10px_rgba(192,192,192,0.15)]",
   },

   3 : {
    label : "3rd",
    classes : "bg-[rgba(205,127,50,0.15)] border-[rgba(205,127,50,0.35)] text-[#cd7f32]",
    glow : "shadow-[0_0_10px_rgba(205,127,50,0.15)]",
 },
};



interface RankBadgeProps {
    rank : number;
    size? : "sm" | "md";
} 



export function RankBadge({rank, size = "md"} : RankBadgeProps) {
  
    const config = rankConfig[rank];

    if(!config) {
        return (

           <span className={cn("font-mono border border-border text-text-muted rounded-md tabular-nums", size === "sm" ? "text-[10px] px-1.5 py-1.5" : "text-xs px-2 py-1")}>
             #{rank}
           </span>
        );
    }



    return (
        <span className={cn("font-mono font-semibold border rounded-md tabular-nums", config.classes, config.glow, size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1")}>

          {config.label}

        </span>
    )
}