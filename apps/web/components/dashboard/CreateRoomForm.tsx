// room creation form 

'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {motion, AnimatePresence} from "framer-motion";
import { createRoomSchema, type CreateRoomInput } from "@/lib/validators/room.schema";
import { useApi } from "@/lib/api";
import { toast } from "../ui/toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RoomSettings } from "./RoomSettings";




export function CreateRoomForm() {
    
  const router = useRouter();
  const {withToken, api} = useApi();

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
     pomodoroMinutes : 25,
     breakMinutes : 5,
     kickAfterSecs : 120,
     maxUsers : 10,
  });


  const {register, handleSubmit, formState : {errors, isSubmitting}} = useForm<CreateRoomInput>({
       resolver : zodResolver(createRoomSchema),
       defaultValues: {name : "", ...settings},
  });


  function handleSettingsChange(field : string, value : number) {
     setSettings((prev) => ({...prev, [field]: value}));
  }


  // submit function 

  async function onSubmit(data : CreateRoomInput) {
      try {
          const room = await withToken((token) => api.rooms.create(token, {...data, ...settings}));

          toast.success("Room created! Entering now...");
          router.push(`/room/${room.id}`);

      } catch(err : any) {
          toast.error(err?.message ?? "Failed to create room");
      }
  }


     return (

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          <Input label="Room name" placeholder="Enter the room name" error={errors.name?.message} hint="Letters, numbers, spaces, dashes allowed" {...register("name")}/>


          {/* setting  */}

          <button type="button" onClick={() => setShowSettings((s) => !s)} className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border bg-bg-elevated hover:bg-bg-hover transition-colors text-sm text-text-secondary hover:text-text-primary">

            <span className="flex items-center gap-2">

          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth=
              "1.5" strokeLinecap="round">

            <circle cx="8" cy="8" r="2.5"/>
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4"/>
          </svg>
           Room Settings
            </span>


        <motion.span
             animate={{ rotate: showSettings ? 180 : 0 }}
              transition={{ duration: 0.2 }}
             >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 5l5 5 5-5"/>
          </svg>
        </motion.span>
      </button>


      {/* collapsible settings  */}

      <AnimatePresence>

         {showSettings && (

            <motion.div initial={{height : 0, opacity : 0}} animate={{height : "auto", opacity : 1}} exit={{height : 0, opacity : 0}} transition={{duration : 0.25, ease : [0.16, 1, 0.3, 1]}} className="overflow-hidden">


              <div className="p-4 rounded-lg border border-border bg-bg-elevated flex flex-col gap-5">

                    <div>
                         {
                          [
                            `⏱ ${settings.pomodoroMinutes}m focus`,
                            `🍵 ${settings.breakMinutes}m break`,
                            `♟️ ${settings.maxUsers}`,
                          ].map((idx) => (

                              <span key={idx} className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-bg-overlay border-border text-text-secondary">
                                {idx}
                              </span>
                          ))
                         }
                    </div>

                    <RoomSettings {...settings} onChange={handleSettingsChange}/>
              </div>
            </motion.div>
         )}
      </AnimatePresence>


      {/* create room button  */}

      <Button type="submit" loading={isSubmitting} className="w-full">

        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">

          <path d="M8 1v14M1 8h14"/>
        </svg>

        Create Room
      </Button>
           
        </form>
     )
}




