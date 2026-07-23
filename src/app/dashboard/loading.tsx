export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      <div className="h-7 w-52 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-72 rounded bg-slate-100" />
      <div className="mt-6 space-y-4">
        <div className="h-28 rounded-2xl bg-slate-100" />
        <div className="h-28 rounded-2xl bg-slate-100" />
        <div className="h-28 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
