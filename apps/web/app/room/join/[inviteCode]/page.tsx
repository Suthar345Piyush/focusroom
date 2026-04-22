// getting invite, then redirect user to room 

'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {motion} from "framer-motion";
import { useApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";


type State = "loading" | "preview" | "joining" | "error";


export default function JoinPage() {
   
    const {inviteCode} = useParams<{inviteCode : string}>();

    const router = useRouter();
    const {isSignedIn} = useAuth();
    const {withToken, api} = useApi();

    const [state, setState] = useState<State>("loading");
    const [room, setRoom] = useState<{name : string; id : string; participantCount : number; maxUsers: number} | null>(null);

    const [error, setError] = useState("");

    useEffect(() => {

        if(!isSignedIn) {
           router.push(`/sign-in?redirect_url=/room/join/${inviteCode}`);
           return;
        }


        async function fetchRoom() {
           try {
                const data = await withToken((t) => api.rooms.join(t, inviteCode));

                setRoom({name : data.name, id : data.id, participantCount : 0, maxUsers : data.maxUsers});

                setState("preview");
           } catch (err : any){
              
              setError(err?.message ?? "Invalid or expired invite link");
              setState("error");
          
           }
        }
        fetchRoom();
    }, [inviteCode, isSignedIn]);


    //join function 

    async function handleJoin() {
        if(!room) return;

        setState("joining");

        try {
            router.push(`/room/${room.id}`);
        } catch {
           toast.error("Could not join room");
           setState("preview");
        }
    }




    return (

        <div className="min-h-dvh flex items-center justify-center p-6 bg-bg-base">

           <div className="pointer-events-none fixed inset-0 flex items-center justify-center">

            <div className="w-150 h-150 rounded-full bg-accent/5 blur-3xl" />
           </div>


           <motion.div initial={{opacity : 0, y : 16}} animate={{opacity : 1, y : 0}} transition={{duration : 0.35, ease : [0.16, 1, 0.3, 1]}} className="relative card-elevated p-8 w-full max-w-sm text-center flex flex-col gap-6">

            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">

              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                 <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5"/>
                 <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
                 
              </div>
              <span className="font-display font-semibold text-text-primary">FocusRoom</span>

            </div>


            {state === "loading" && (

            <div className="flex flex-col items-center gap-3 py-4">

              <svg className="animate-spin text-accent" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round"/>
              </svg>

              <p className="text-text-muted text-sm">
                Checking invite...
              </p>  
            </div>
            )}


            {state === "preview" && room && (
              <>

                 <div className="flex flex-col gap-1">

                   <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
                    You've been invited to
                   </p>

                   <h1 className="font-display text-2xl font-bold text-text-primary">
                    {room.name}
                   </h1>

                 </div>


        //  user in the room
         
        <div className="flex items-center justify-center gap-1.5">

           {Array.from({length : room.maxUsers}).map((_, i) => (

              <span key={i} className={`w-2 h-5 rounded-full ${i < room.participantCount ? "bg-status-active" : "bg-border"}`} />

           ))}

           <span className="ml-2 font-mono text-xs text-text-muted">
            {room.participantCount}/{room.maxUsers}
           </span>

        </div>


       <Button onClick={handleJoin} loading={state === "preview"} className="w-full">
          Enter room ➡️   
       </Button>

       </>
     )}





     {state === "error" && (
           
           <>

            <div className="flex flex-col items-center gap-2">

              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/>
                </svg>
              </div>

              <p className="text-text-primary font-medium">{error}</p>
            </div>

            <Button className="w-full" variant="ghost" onClick={() => router.push("/dashboard")}>⬅️ Back to dashboard</Button>
           
           </>
     )}
           </motion.div>

        </div>
    )



}