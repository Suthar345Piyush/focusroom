export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">


      {/* Left — brand panel */}


      <div className="hidden lg:flex flex-col justify-between p-14 border-r border-border relative overflow-hidden">


        {/* Background accent blobs */}


        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-amber/5 blur-3xl pointer-events-none" />



        {/* Logo */}


        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5"/>
              <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-semibold text-text-primary text-lg tracking-tight">
            FocusRoom
          </span>
        </div>



        {/* Quote */}


        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-semibold text-text-primary leading-tight mb-4">
            "Deep work is the superpower of the 21st century."
          </blockquote>
          <p className="text-text-muted font-mono text-xs tracking-widest uppercase">
            Cal Newport
          </p>
        </div>



        {/* Feature list */}



        <ul className="relative z-10 flex flex-col gap-3">
          {[
            ["⏱", "Synchronized pomodoro timers"],
            ["👁", "Live presence & status tracking"],
            ["💬", "Real-time broadcast chat"],
            ["🏆", "Leaderboard for the last one focused"],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="text-base">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>


      {/* Right — auth form */}

      
      <div className="flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5"/>
              <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-semibold text-sm">FocusRoom</span>
        </div>
        <div className="w-full max-w-sm animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}