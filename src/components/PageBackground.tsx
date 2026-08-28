'use client'

export function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft diffused background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 blur-[140px] rounded-full opacity-60" />
      <div className="absolute top-[30%] right-0 w-[600px] h-[600px] bg-primary/3 blur-[160px] rounded-full opacity-40" />
      <div className="absolute bottom-[10%] left-0 w-[700px] h-[700px] bg-primary/4 blur-[180px] rounded-full opacity-40" />

      {/* Clean geometric subtle grid overlay */}
      <div className="absolute inset-0 subtle-grid opacity-60" />

      {/* Subtle fade overlay at top & bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/90" />
    </div>
  )
}
