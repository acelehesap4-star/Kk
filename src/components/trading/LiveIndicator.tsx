export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success shadow-lg shadow-success/50" />
      </div>
      <span className="text-xs font-semibold text-success">LIVE</span>
    </div>
  );
}
