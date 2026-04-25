// using sidebar component  in this web/app/(dashboard)/layout 


import { Sidebar } from "@/components/dashboard/Sidebar";
import React from "react";


export default function DashboardLayout({children} : {children : React.ReactNode}) {
    
   return ( 
       <div className="flex h-dvh overflow-hidden bg-bg-base">
         
          <Sidebar />

          <main className="flex-1 overflow-y-auto relative">

          <div className="pointer-events-none absolute top-0 right-0 w-125 h-125 rounded-full bg-accent/[0.04] blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-8 py-10">
             {children}
          </div>
          </main>
       </div>
   );
}




