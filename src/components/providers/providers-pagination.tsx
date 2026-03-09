import Link from 'next/link';

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query: Record<string, string | undefined>;
};

function buildPageHref(
  basePath: string,
  query: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.set(key, value);
    }
  });

  params.set('page', String(page));

  return `${basePath}?${params.toString()}`;
}

export default function ProvidersPagination({
  currentPage,
  totalPages,
  basePath,
  query,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      aria-label="Providers pagination"
      className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <div className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildPageHref(basePath, query, previousPage)}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-400">
            Previous
          </span>
        )}

        {currentPage < totalPages ? (
          <Link
            href={buildPageHref(basePath, query, nextPage)}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-400">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}