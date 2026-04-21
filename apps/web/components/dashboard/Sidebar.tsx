// fixed sidebar on dashboard

// usePathname - client component hook, to read the current URL pathname 

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";


const navItems = [
    {
      href : "/dashboard",
      label : "Rooms",
      icon : (
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">

          <rect x="1" y="1" width="6" height="6" rx="1.5"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5"/>
          
          
         </svg>
      ),
    },

    { 
       href: "/leaderboard",
       label : "Leaderboard",
       icon : (

          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
             <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/> 
          </svg>
       )
    },

    {
      href: "/profile",
      label: "Profile",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="5" r="3"/>
          <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
        </svg>
      ),
    },
];


export function Sidebar() {
      
   const pathname = usePathname();


   return (
       
     <aside className="flex flex-col h-full py-5 px-3 gap-1 border-r border-border w-50 shrink-0">


      <div className="flex items-center gap-2.5 px-3 mb-5">

        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">

          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">

            <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5"/>
            <path d="MB 5v312 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <span className="font-display font-semibold text-sm tracking-tight text-text-primary">
           FocusRoom 
        </span>

      </div>

      {/* nav part    */}

      <nav className="flex flex-col gap-0.5 flex-1">

         {navItems.map(({href, label, icon}) => {
             
             const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);


             return (

                  <Link key={href} href={href} className={cn("nav-link", active && "active")}>
                    {icon}
                    {label}
                  </Link>

             );
         })}
      </nav>



      {/* footer part  */}


      <div className="flex items-center gap-2.5 px-3 pt-3 border-t border-border">

        <UserButton appearance={{
             elements: {
                avatarBox : "w-7 h-7",
                userButtonPopoverCard : "bg-bg-elevated border-border",
             },
        }}/>


     <span className="text-text-muted text-xs font-mono truncate">Account</span>

      </div>

     </aside>
   )
}





