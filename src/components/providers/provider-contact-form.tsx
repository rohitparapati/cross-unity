'use client';

import { useState } from 'react';

type Props = {
  providerId: string;
  providerName: string;
};

export default function ProviderContactForm({
  providerId,
  providerName,
}: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    companyWebsite: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          ...form,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error?.message ?? 'Could not send inquiry.');
        return;
      }

      setSuccessMessage(
        result.message ?? `Your message was sent to ${providerName}.`,
      );

      setForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        companyWebsite: '',
      });
    } catch {
      setErrorMessage('Something went wrong while sending your inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Your name
        </label>
        <input
          id="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Your email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-slate-700">
          Phone
        </label>
        <input
          id="phone"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsite}
          onChange={(event) => updateField('companyWebsite', event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  );
}