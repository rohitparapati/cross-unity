type InquiryItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'NEW' | 'RESPONDED';
  createdAt: Date;
};

type Props = {
  inquiries: InquiryItem[];
};

export default function ProviderInboxList({ inquiries }: Props) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
        No inquiries yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="rounded-2xl border bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{inquiry.name}</h2>
              <p className="text-sm text-slate-500">
                {inquiry.email}
                {inquiry.phone ? ` • ${inquiry.phone}` : ''}
              </p>
            </div>

            <span
              className={
                inquiry.status === 'NEW'
                  ? 'rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800'
                  : 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'
              }
            >
              {inquiry.status}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-700">{inquiry.message}</p>

          <p className="mt-4 text-xs text-slate-500">
            Received on {new Date(inquiry.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}