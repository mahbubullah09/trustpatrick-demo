'use client';

import { useEffect, useState } from 'react';
import type { Expert } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGeneralServices, submitQuote, resetQuote } from '@/store/slices/quoteSlice';

const RESIDENTIAL_TYPE_ID   = 1;
const RESIDENTIAL_TYPE_TEXT = 'Residential';

const TIMEFRAME_OPTIONS = [
  'Urgent - Need Completed ASAP',
  'No Urgency - 3 to 6 Weeks',
  'Price Shopping - Price Comparing',
];

interface Props {
  selectedExperts:      Expert[];
  noContractors?:       boolean;
  serviceCategoryCodes: string[];
}

export default function QuoteRequestForm({
  selectedExperts,
  noContractors = false,
  serviceCategoryCodes,
}: Props) {
  const dispatch = useAppDispatch();
  const { generalData, submitting, submitted, submitError } = useAppSelector((s) => s.quote);

  const locked = !noContractors && selectedExperts.length === 0;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    timeframe: '', description: '',
  });

  const [selectedMainId,   setSelectedMainId]   = useState('');
  const [selectedMainText, setSelectedMainText] = useState('');
  const [selectedCatCode,  setSelectedCatCode]  = useState('');
  const [selectedCatText,  setSelectedCatText]  = useState('');

  // Fetch service categories via Redux thunk
  useEffect(() => {
    if (!serviceCategoryCodes?.length) return;
    dispatch(fetchGeneralServices(serviceCategoryCodes));
    return () => { dispatch(resetQuote()); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredMainCategories = generalData
    ? (generalData.mainCategories.find((m) => m.type_id === RESIDENTIAL_TYPE_ID)?.categories ?? [])
    : [];

  const filteredServiceCategories = selectedMainId && generalData
    ? generalData.serviceCategories.filter(
        (c) => c.type_id === RESIDENTIAL_TYPE_ID && c.main_category_id === parseInt(selectedMainId)
      )
    : [];

  const level2Label = 'What type of driveway services are you looking for?';
  const level3Label = selectedMainText
    ? `What type of ${selectedMainText} services do you need?`
    : 'Select service category';

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleMainChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedMainId(e.target.value);
    setSelectedMainText(e.target.options[e.target.selectedIndex].text);
    setSelectedCatCode(''); setSelectedCatText('');
  }
  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCatCode(e.target.value);
    setSelectedCatText(e.target.options[e.target.selectedIndex].text);
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked) return;
    dispatch(submitQuote({
      first_name: form.firstName, last_name: form.lastName,
      email: form.email, phone: form.phone,
      address: form.address, city: form.city, state: form.state, zip: form.zip,
      timeframe: form.timeframe, description: form.description,
      service_type_id: RESIDENTIAL_TYPE_ID, service_type_text: RESIDENTIAL_TYPE_TEXT,
      ...(selectedMainId  && { main_category_id: selectedMainId, main_category_text: selectedMainText }),
      ...(selectedCatCode && { service_category_code: selectedCatCode, service_category_text: selectedCatText }),
      ...(noContractors ? {} : {
        contractor_ids:   selectedExperts.map((ex) => ex.id),
        contractor_names: selectedExperts.map((ex) => ex.business_name ?? ex.name),
      }),
      isLead: noContractors,
    }));
  }

  // ── Field styles ──
  const field = `w-full rounded-lg px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2`;
  const activeField  = `${field} bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-brand-action focus:border-brand-action`;
  const lockedField  = `${field} bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed`;
  const inputClass   = locked ? lockedField : activeField;

  // ── Success ──
  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          {noContractors ? "You're on the List!" : 'Quote Request Sent!'}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          {noContractors
            ? "We'll reach out as soon as contractors become available in your area."
            : `${selectedExperts.length} contractor${selectedExperts.length !== 1 ? 's have' : ' has'} been notified. Expect a response within 24 hours.`}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

      {/* ── Header band ── */}
      {locked ? (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-sm">Request Free Quotes</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Select 1–3 contractors above to unlock this form
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5 select-none pointer-events-none blur-[2px] opacity-40">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 bg-gray-200 rounded-lg" />
              <div className="h-9 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-9 bg-gray-200 rounded-lg" />
            <div className="h-9 bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 bg-gray-200 rounded-lg" />
              <div className="h-9 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-20 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-300 rounded-lg" />
          </div>
        </div>
      ) : (
        <div className={`px-6 py-5 border-b ${noContractors ? 'bg-amber-50 border-amber-100' : 'bg-brand-action/5 border-brand-action/10'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5
              ${noContractors ? 'bg-amber-100' : 'bg-brand-action/10'}`}>
              {noContractors ? (
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-brand-action" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${noContractors ? 'text-amber-800' : 'text-brand-navy'}`}>
                {noContractors ? 'Get Notified When Contractors Are Available' : 'Request Free Quotes'}
              </p>
              {noContractors ? (
                <p className="text-xs text-amber-700 mt-0.5">
                  No contractors listed yet — leave your details and we&apos;ll reach out soon.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedExperts.map((e) => (
                    <span key={e.id}
                      className="inline-flex items-center gap-1 text-xs bg-white border border-brand-action/20
                        text-brand-action px-2 py-0.5 rounded-full font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      {e.business_name ?? e.name ?? 'Contractor'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Form body ── */}
      {!locked && (
        <div className="bg-white px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Cascading dropdowns */}
            {generalData && filteredMainCategories.length > 0 && (
              <div className="space-y-4 pb-5 border-b border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {level2Label}
                  </label>
                  <select value={selectedMainId} onChange={handleMainChange} required
                    className={`${activeField} appearance-none`}>
                    <option value="">— Select —</option>
                    {filteredMainCategories.map((c) => (
                      <option key={c.key} value={c.key}>{c.value}</option>
                    ))}
                  </select>
                </div>
                {selectedMainId && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                      {level3Label}
                    </label>
                    <select value={selectedCatCode} onChange={handleCategoryChange} required
                      className={`${activeField} appearance-none`}>
                      <option value="">— Select —</option>
                      {filteredServiceCategories.map((c) => (
                        <option key={c.key} value={c.key}>{c.value}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                  placeholder="Jane" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                  placeholder="Smith" className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  required placeholder="jane@example.com" className={`${inputClass} pl-9`} />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Phone / Mobile <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  required placeholder="(555) 000-0000" className={`${inputClass} pl-9`} />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* Project location */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-brand-action" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Project Location
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input type="text" name="address" value={form.address} onChange={handleChange}
                    required placeholder="123 Main St" className={activeField} autoComplete="off" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input type="text" name="city" value={form.city} onChange={handleChange}
                    required placeholder="City" className={activeField} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input type="text" name="state" value={form.state} onChange={handleChange}
                    required placeholder="CO" className={activeField} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Zip Code <span className="text-red-400">*</span>
                  </label>
                  <input type="text" name="zip" value={form.zip} onChange={handleChange}
                    required placeholder="80201" className={activeField} />
                </div>
              </div>
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                When do you need it done? <span className="text-red-400">*</span>
              </label>
              <select name="timeframe" value={form.timeframe} onChange={handleChange}
                required className={`${activeField} appearance-none`}>
                <option value="">— Select timeframe —</option>
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Project details */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Project Details <span className="text-red-400">*</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange}
                required rows={4} placeholder="Describe your project — size, timeline, materials, any special requirements…"
                className={`${activeField} resize-none`} />
            </div>

            {submitError && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {submitError}
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full bg-brand-orange hover:bg-orange-500 active:bg-orange-600 text-white font-bold
                text-sm rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Form
                </>
              )}
            </button>

          </form>
        </div>
      )}
    </div>
  );
}
