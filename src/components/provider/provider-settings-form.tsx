'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  currentEmail: string;
};

export default function ProviderSettingsForm({ currentEmail }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function updateEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setEmailMessage('');
    setSavingEmail(true);

    try {
      const response = await fetch('/api/provider/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error?.message ?? 'Could not update email.');
        return;
      }

      setEmailMessage(result.message ?? 'Email updated successfully.');
      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while updating email.');
    } finally {
      setSavingEmail(false);
    }
  }

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setPasswordMessage('');
    setSavingPassword(true);

    try {
      const response = await fetch('/api/provider/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error?.message ?? 'Could not update password.');
        return;
      }

      setPasswordMessage(result.message ?? 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setErrorMessage('Something went wrong while updating password.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={updateEmail} className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Update Contact Email</h2>

        <div className="mt-4 space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
            required
          />
        </div>

        {emailMessage ? (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {emailMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={savingEmail}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {savingEmail ? 'Updating...' : 'Update Email'}
        </button>
      </form>

      <form onSubmit={updatePassword} className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
              required
            />
          </div>
        </div>

        {passwordMessage ? (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {passwordMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={savingPassword}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {savingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 lg:col-span-2">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}