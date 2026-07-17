export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin" />
        <p className="text-[13px] text-muted">Loading dashboard...</p>
      </div>
    </div>
  );
}
