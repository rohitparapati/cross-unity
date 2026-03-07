export default function HelloPage() {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold">Hello 👋</h2>
      <p className="mt-2 text-slate-600">
        M0 complete. Next we’ll build the real landing page and providers listing UI.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-4">
        <div className="text-sm font-semibold">Manual checks</div>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
          <li>Home loads</li>
          <li>Hello page loads</li>
          <li>API health responds</li>
        </ul>
      </div>
    </div>
  );
}