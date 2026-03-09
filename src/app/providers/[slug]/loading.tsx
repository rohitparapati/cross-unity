export default function ProvidersLoading() {
  return (
    <div className="space-y-6 py-10">
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-4 rounded-2xl border bg-white p-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-6">
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="mt-6 h-10 w-full animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}