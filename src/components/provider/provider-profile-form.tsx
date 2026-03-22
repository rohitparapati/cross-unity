'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CategoryOption = {
  id: string;
  name: string;
};

type ProviderProfile = {
  businessName: string;
  categoryId: string;
  phone: string;
  bio: string;
  city: string;
  state: string;
  zip: string;
  pricingText: string;
  availabilityText: string;
};

type Props = {
  categories: CategoryOption[];
  initialValues: ProviderProfile;
};

export default function ProviderProfileForm({ categories, initialValues }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof ProviderProfile, value: string) {
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
      const response = await fetch('/api/provider/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error?.message ?? 'Could not update profile.');
        return;
      }

      setSuccessMessage(result.message ?? 'Profile updated successfully.');
      router.refresh();
    } catch {
      setErrorMessage('Something went wrong while updating the profile.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="businessName" className="text-sm font-medium text-slate-700">
          Business name
        </label>
        <input
          id="businessName"
          value={form.businessName}
          onChange={(event) => updateField('businessName', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(event) => updateField('categoryId', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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

      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium text-slate-700">
          City
        </label>
        <input
          id="city"
          value={form.city}
          onChange={(event) => updateField('city', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium text-slate-700">
          State
        </label>
        <input
          id="state"
          value={form.state}
          onChange={(event) => updateField('state', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="zip" className="text-sm font-medium text-slate-700">
          ZIP
        </label>
        <input
          id="zip"
          value={form.zip}
          onChange={(event) => updateField('zip', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label htmlFor="pricingText" className="text-sm font-medium text-slate-700">
          Pricing
        </label>
        <input
          id="pricingText"
          value={form.pricingText}
          onChange={(event) => updateField('pricingText', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          placeholder="Example: Service starts at $75"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label htmlFor="availabilityText" className="text-sm font-medium text-slate-700">
          Availability
        </label>
        <input
          id="availabilityText"
          value={form.availabilityText}
          onChange={(event) => updateField('availabilityText', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          placeholder="Example: Mon-Sat 8AM - 6PM"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label htmlFor="bio" className="text-sm font-medium text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          rows={5}
          value={form.bio}
          onChange={(event) => updateField('bio', event.target.value)}
          className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-slate-400"
          required
        />
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 md:col-span-2">
          {successMessage}
        </div>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}