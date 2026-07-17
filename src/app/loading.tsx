export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#333] border-t-[#ebebeb] rounded-full animate-spin" />
        <p className="text-[13px] text-[#6b6b6b]">Loading...</p>
      </div>
    </div>
  );
}
