'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  providerId: string;
};

export default function AdminReviewActions({ providerId }: Props) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function approveProvider() {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/providers/${providerId}/approve`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error?.message ?? 'Could not approve provider.');
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while approving.');
    } finally {
      setIsLoading(false);
    }
  }

  async function denyProvider() {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/providers/${providerId}/deny`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error?.message ?? 'Could not deny provider.');
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while denying.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        rows={3}
        placeholder="Reason if denying this provider..."
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-slate-400"
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={approveProvider}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
        >
          Approve
        </button>

        <button
          type="button"
          onClick={denyProvider}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-70"
        >
          Deny
        </button>
      </div>
    </div>
  );
}