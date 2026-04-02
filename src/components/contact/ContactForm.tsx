'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/uiSlice';

export default function ContactForm() {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submit — replace with your real API call
    await new Promise((r) => setTimeout(r, 1000));

    dispatch(addToast({ message: 'Message sent! We\'ll reply within one business day.', type: 'success' }));
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  }

  const inputClass = `w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
    text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-action`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">
            Your Name *
          </label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange}
            required placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">
            Email Address *
          </label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            required placeholder="jane@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">
          Subject *
        </label>
        <select name="subject" value={form.subject} onChange={handleChange} required className={inputClass}>
          <option value="">Select a topic…</option>
          <option value="homeowner">Homeowner Support</option>
          <option value="contractor">Contractor Listing</option>
          <option value="review">Review / Complaint</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">
          Message *
        </label>
        <textarea
          name="message" value={form.message} onChange={handleChange}
          required rows={5} placeholder="Tell us how we can help…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
