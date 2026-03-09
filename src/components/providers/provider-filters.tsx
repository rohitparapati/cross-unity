import Link from 'next/link';

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  categories: CategoryOption[];
  initialValues: {
    q: string;
    category: string;
    location: string;
    verified: boolean;
  };
};

export default function ProviderFilters({
  categories,
  initialValues,
}: Props) {
  return (
    <form
      action="/providers"
      method="GET"
      className="grid gap-4 rounded-2xl border bg-white p-4 md:grid-cols-2 xl:grid-cols-5"
    >
      <div className="space-y-2 xl:col-span-2">
        <label
          htmlFor="q"
          className="text-sm font-medium text-slate-700"
        >
          Search services or provider name
        </label>
        <input
          id="q"
          name="q"
          defaultValue={initialValues.q}
          placeholder="Plumbing, cleaning, repairs..."
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="category"
          className="text-sm font-medium text-slate-700"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={initialValues.category}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-slate-400"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="location"
          className="text-sm font-medium text-slate-700"
        >
          City or ZIP
        </label>
        <input
          id="location"
          name="location"
          defaultValue={initialValues.location}
          placeholder="St Louis or 63103"
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div className="flex flex-col justify-between gap-3 xl:col-span-5 xl:flex-row xl:items-end">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="verified"
            value="true"
            defaultChecked={initialValues.verified}
            className="h-4 w-4 rounded border-slate-300"
          />
          Verified providers only
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Apply Filters
          </button>

          <Link
            href="/providers"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear
          </Link>
        </div>
      </div>
    </form>
  );
}