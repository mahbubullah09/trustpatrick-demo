'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption {
  value: string;
  label: string;
}

interface DropdownPos { top: number; left: number; width: number }

interface Props {
  value:        string;
  onChange:     (value: string) => void;
  options:      SelectOption[];
  allLabel?:    string;
  placeholder?: string;
  disabled?:    boolean;
  className?:   string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  allLabel    = 'All',
  placeholder = 'Search…',
  disabled    = false,
  className   = '',
}: Props) {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const [pos,   setPos]   = useState<DropdownPos | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  // Calculate fixed position from trigger's bounding rect
  function openDropdown() {
    if (disabled || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setOpen(true);
  }

  // Close on outside click (check both trigger and dropdown portal)
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      const portal = document.getElementById('searchable-select-portal');
      if (
        triggerRef.current?.contains(target) ||
        portal?.contains(target)
      ) return;
      setOpen(false);
      setQuery('');
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Reposition on scroll / resize while open
  useEffect(() => {
    if (!open) return;
    function reposition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  // Focus search input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  function select(val: string) {
    onChange(val);
    setOpen(false);
    setQuery('');
  }

  const dropdown = open && pos ? (
    <div
      id="searchable-select-portal"
      style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
    >
      {/* Search input */}
      <div className="p-2 border-b border-gray-100">
        <div className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm bg-transparent focus:outline-none text-brand-dark"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Options list */}
      <div className="max-h-52 overflow-y-auto">
        <button
          type="button"
          onClick={() => select('')}
          className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-brand-light
            ${!value ? 'text-brand-action font-semibold bg-brand-light' : 'text-brand-gray'}`}
        >
          {allLabel}
        </button>

        {filtered.length === 0 ? (
          <p className="px-3 py-3 text-sm text-brand-gray text-center">
            No results for &ldquo;{query}&rdquo;
          </p>
        ) : (
          filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-brand-light
                ${value === opt.value ? 'text-brand-action font-semibold bg-brand-light' : 'text-brand-dark'}`}
            >
              {opt.label}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={openDropdown}
        className={`${className} flex items-center justify-between text-left gap-2`}
      >
        <span className={`truncate ${selected ? 'text-brand-dark' : 'text-gray-400'}`}>
          {selected?.label ?? allLabel}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Portal — renders outside any overflow:hidden ancestor */}
      {typeof document !== 'undefined' && dropdown
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  );
}
