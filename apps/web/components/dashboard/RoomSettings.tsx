 // room settings components 

'use client';

import { cn, formatDuration } from "@/lib/utils";


interface SliderFieldProps {
    label:string;
    hint : string;
    value : number;
    min : number;
    max : number;
    step : number;
    format : (v : number) => string;
    onChange : (v : number) => void;
}

function SliderField({label, hint, value, min, max, step, format, onChange} : SliderFieldProps){
     
      return (

         <div className="flex flex-col gap-2">
           <div className="flex items-center justify-between">
             <label className="label mb-0">{label}</label>

             <span className="font-mono text-sm text-text-accent bg-accent-dim px-2 oy-0.5 rounded-md">
              {format(value)}
             </span>
           </div>

           <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}  className={cn(
             "w-full h-1.5 rounded-full appearance-none cursor-pointer",
             "bg-bg-elevated accent-(--accent)",
             "[&::-webkit-slider-thumb]:appearance-none",
             "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
             "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent",
             "[&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer",
             "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-base",
           )} />

           <p className="text-text-muted text-xs">
             {hint}
            </p> 
           
         </div>         
      );
}



interface RoomSettingsProps {
    pomodoroMinutes: number;
    breakMinutes : number;
    kickAfterSecs : number;
    maxUsers : number;
    onChange : (field :string, value : number) => void;
}



export function RoomSettings({
      pomodoroMinutes, breakMinutes, kickAfterSecs, maxUsers, onChange,
} : RoomSettingsProps) {
      return (

         <div className="flex flex-col gap-5">

           <SliderField label="Focus duration" hint="Length of each pomodoro focus block" value={pomodoroMinutes} min={5} max={90} step={5} format={(v) => `${v} min`} onChange={(v) => onChange("pomodoroMinutes", v)}/>

           <SliderField label="Break duration" hint="Short break between focused sessions" value={breakMinutes} min={1} max={30} step={1} format={(v) => `${v} min`} onChange={(v) => onChange("breakMinutes", v)}/>

           <SliderField label="Auto-kick after" hint="Inactive users are removed after this long" value={kickAfterSecs} min={30} max={600} step={30} format={formatDuration} onChange={(v) => onChange("kickAfterSecs", v)}/>

           <SliderField label="Max participants" hint="Maximum users allowed in the room" value={maxUsers} min={2} max={10} step={1} format={(v) => `${v} users`} onChange={(v) => onChange("maxUsers", v)}/>

         </div>
      );
}







