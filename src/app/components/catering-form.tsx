'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type FormData = {
  companyName: string
  name: string
  email: string
  phone: string
  deliveryDate: string
  deliveryTime: string
  address: string
  postalCode: string
}

const INITIAL: FormData = {
  companyName: '',
  name: '',
  email: '',
  phone: '',
  deliveryDate: '',
  deliveryTime: '',
  address: '',
  postalCode: '',
}

// Minimum date = tomorrow
function getTomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export function CateringForm() {
  const t = useTranslations('cateringPage')
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/catering-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm(INITIAL)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-plum/10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-plum">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-dark">{t('successTitle')}</h3>
        <p className="max-w-sm text-muted">{t('successMessage')}</p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm text-dark placeholder-muted/60 outline-none transition-colors duration-200 focus:border-plum focus:ring-2 focus:ring-plum/20'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className={labelClass}>
            {t('companyName')} <span className="text-plum">*</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            value={form.companyName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>
            {t('yourName')} <span className="text-plum">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            {t('email')} <span className="text-plum">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t('phone')} <span className="text-plum">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3 — Delivery date + time */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="deliveryDate" className={labelClass}>
            {t('deliveryDate')} <span className="text-plum">*</span>
          </label>
          <input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            required
            min={getTomorrowDate()}
            value={form.deliveryDate}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-muted/70">{t('formNote')}</p>
        </div>
        <div>
          <label htmlFor="deliveryTime" className={labelClass}>
            {t('deliveryTime')} <span className="text-plum">*</span>
          </label>
          <input
            id="deliveryTime"
            name="deliveryTime"
            type="time"
            required
            value={form.deliveryTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 4 — Address + postal code */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="address" className={labelClass}>
            {t('address')} <span className="text-plum">*</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={form.address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="postalCode" className={labelClass}>
            {t('postalCode')} <span className="text-plum">*</span>
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            required
            value={form.postalCode}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{t('errorMessage')}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full border border-plum/30 bg-plum px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-dark disabled:opacity-60"
        >
          {status === 'loading' ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  )
}
