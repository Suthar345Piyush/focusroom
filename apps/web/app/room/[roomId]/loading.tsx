// loading while entering into the room 


export default function RoomLoading() {
    return (
       
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-bg-base">

      <svg className="animate-spin text-accent w-10 h-10" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="var(--border)" strokeWidth="4"/>
        <path d="M24 4a20 20 0 0118.4 12" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"/>
      </svg>

      <p className="font-mono text-sm text-text-muted">Entering room...</p>

      </div>
       

    )
}