export default function HomePage() {
  return (
    <div className="py-10">
      <section className="rounded-3xl border bg-gradient-to-b from-slate-50 to-white p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            MVP in progress
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Find trusted home service providers near you.
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Browse without an account. Providers can register, get verified, and manage inquiries in a
            simple dashboard.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/providers"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Browse Providers
            </a>
            <a
              href="/provider/register"
              className="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              I’m a Provider
            </a>
          </div>

          <div className="mt-8 rounded-2xl border bg-white p-4 text-left">
            <div className="text-sm font-semibold">Quick health check</div>
            <div className="mt-2 text-sm text-slate-600">
              Open <span className="font-mono">/api/health</span> to confirm the backend is alive.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}