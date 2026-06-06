'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReservePanelProps {
  open: boolean
  onClose: () => void
}

const PRICE_PER_NIGHT = 4500
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const POLICIES = [
  { title: 'Arrival & Departure', content: 'Check-in from 15:00 · Check-out before 11:00 · Early check-in subject to availability · Late check-out on request' },
  { title: 'Cancellation Policy', content: 'Free cancellation up to 30 days before arrival · 50% charge within 30 days · Full charge within 7 days' },
  { title: 'House Rules', content: 'No smoking indoors · Pets on request · Maximum 20 guests · Private security included · Concierge service available 24/7' },
]

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate() }
function getFirstDay(year: number, month: number) { return new Date(year, month, 1).getDay() }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate() }
function isInRange(date: Date, start: Date | null, end: Date | null) { if (!start || !end) return false; return date > start && date < end }
function formatShort(d: Date) { return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}` }

function CalendarMonth({
  year, month, checkIn, checkOut, hoverDate, onDayClick, onDayHover, cellSize = 44,
}: {
  year: number; month: number; checkIn: Date | null; checkOut: Date | null
  hoverDate: Date | null; onDayClick: (d: Date) => void; onDayHover: (d: Date | null) => void
  cellSize?: number
}) {
  const [localHover, setLocalHover] = useState<number | null>(null)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const days = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)
  const rangeEnd = checkOut || hoverDate

  const cells: React.ReactNode[] = []
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} style={{ width: cellSize, height: cellSize }} />)

  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d)
    const isPast = date < today
    const isCI = !!(checkIn && isSameDay(date, checkIn))
    const isCO = !!(checkOut && isSameDay(date, checkOut))
    const inRange = !isPast && isInRange(date, checkIn, rangeEnd)
    const isToday = isSameDay(date, today)
    const isHov = localHover === d && !isPast && !isCI && !isCO

    cells.push(
      <div
        key={d}
        onClick={() => !isPast && onDayClick(date)}
        onMouseEnter={() => { if (!isPast) { setLocalHover(d); onDayHover(date) } }}
        onMouseLeave={() => { setLocalHover(null); onDayHover(null) }}
        style={{
          width: cellSize, height: cellSize,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          fontSize: cellSize <= 40 ? 13 : 14,
          fontFamily: 'var(--font-jost), sans-serif',
          fontWeight: 300,
          borderRadius: 0,
          cursor: isPast ? 'default' : 'pointer',
          opacity: isPast ? 0.2 : 1,
          background: (isCI || isCO) ? '#C9A96E' : isHov ? 'rgba(201,169,110,0.12)' : inRange ? 'rgba(201,169,110,0.08)' : 'transparent',
          color: (isCI || isCO) ? '#1A1612' : isToday ? '#C9A96E' : 'rgba(245,240,232,0.8)',
          transition: 'background 0.15s ease, color 0.15s ease',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {inRange && !isCI && !isCO && (
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(201,169,110,0.3)', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        )}
        <span style={{ position: 'relative', zIndex: 1, lineHeight: 1 }}>{d}</span>
        {isCI && <span style={{ fontSize: 6, fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, color: '#1A1612', marginTop: 2, letterSpacing: '0.05em', lineHeight: 1 }}>arrival</span>}
        {isCO && <span style={{ fontSize: 6, fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, color: '#1A1612', marginTop: 2, letterSpacing: '0.05em', lineHeight: 1 }}>departure</span>}
      </div>
    )
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 18, color: '#F5F0E8', marginBottom: 20, letterSpacing: '0.1em' }}>
        {MONTH_NAMES[month]} {year}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap: 4, marginBottom: 8 }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ width: cellSize, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, color: 'rgba(245,240,232,0.4)', letterSpacing: '0.2em' }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap: 4 }}>
        {cells}
      </div>
    </div>
  )
}

const STEPS = [
  { num: 1, label: 'Dates' },
  { num: 2, label: 'Guests' },
  { num: 3, label: 'Contact' },
]

export function ReservePanel({ open, onClose }: ReservePanelProps) {
  const today = new Date()
  const [calBase, setCalBase] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)
  const [openPolicy, setOpenPolicy] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const datesSet = !!(checkIn && checkOut)
  const activeStep = !datesSet ? 1 : 2

  let month2 = calBase.month + 1; let year2 = calBase.year
  if (month2 > 11) { month2 = 0; year2++ }

  const handleDayClick = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(date); setCheckOut(null) }
    else { if (date <= checkIn) { setCheckIn(date); setCheckOut(null) } else setCheckOut(date) }
  }

  const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0
  const prevMonth = () => setCalBase(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 })
  const nextMonth = () => setCalBase(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 })

  const cellSize = isMobile ? 40 : 44

  const fieldStyle = (name: string): React.CSSProperties => ({
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focusedField === name ? '#C9A96E' : 'rgba(201,169,110,0.3)'}`,
    color: '#F5F0E8', fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 16,
    padding: '8px 0', outline: 'none', width: '100%', transition: 'border-color 0.2s ease',
  })

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, fontSize: 10,
    textTransform: 'uppercase', letterSpacing: '0.3em', color: '#C9A96E', marginBottom: 4, display: 'block',
  }

  const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 11,
    textTransform: 'uppercase', letterSpacing: '0.3em', color: '#C9A96E', marginBottom: 24,
  }

  const bodyPad = isMobile ? '24px 0 80px' : '48px 0 80px'
  const headerPad = isMobile ? '24px 0 20px' : '32px 0 24px'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100vh' }} animate={{ y: 0 }} exit={{ y: '100vh' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(13,11,9,0.97)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}
        >
          {/* Centered content wrapper */}
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: isMobile ? '0 24px' : '0 80px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: headerPad, borderBottom: '1px solid rgba(201,169,110,0.3)', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-okaluera), Georgia, serif', fontSize: isMobile ? 24 : 32, color: '#F5F0E8', fontWeight: 400 }}>Villa Aura</span>
            <button onClick={onClose} style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 28, color: 'rgba(245,240,232,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '4px 8px' }}>×</button>
          </div>

          {/* Body — single column on mobile, two column on desktop */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 40 : 80, height: 'calc(100vh - 80px)', overflowY: isMobile ? 'auto' : 'hidden', alignItems: 'flex-start', paddingTop: 32, paddingBottom: 48 }}>

            {/* LEFT / TOP section: dates + guests */}
            <div style={{ flex: isMobile ? 'none' : '1', minWidth: 0, maxWidth: isMobile ? 'none' : '600px', alignSelf: isMobile ? 'auto' : 'stretch', overflowY: isMobile ? 'visible' : 'auto' }}>

              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 32 : 48, marginBottom: isMobile ? 32 : 48 }}>
                {STEPS.map((step, i) => {
                  const isActive = step.num <= activeStep
                  return (
                    <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 32 : 48 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1px solid ${isActive ? '#C9A96E' : 'rgba(201,169,110,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'var(--font-jost)', fontWeight: 300, color: isActive ? '#C9A96E' : 'rgba(245,240,232,0.3)', transition: 'all 0.3s ease' }}>
                          {step.num}
                        </div>
                        <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: isActive ? 300 : 200, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: isActive ? '#C9A96E' : 'rgba(245,240,232,0.3)', transition: 'all 0.3s ease' }}>
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ position: 'absolute', width: 48, height: 1, background: 'rgba(201,169,110,0.2)', marginLeft: 34 }} />
                      )}
                    </div>
                  )
                })}
              </div>

              <p style={sectionTitle}>Select your dates</p>

              {/* Calendar nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: 'rgba(245,240,232,0.6)', cursor: 'pointer', fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 18, padding: '4px 8px', minWidth: 44, minHeight: 44, transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.6)')}>←</button>
                <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: 'rgba(245,240,232,0.6)', cursor: 'pointer', fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 18, padding: '4px 8px', minWidth: 44, minHeight: 44, transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.6)')}>→</button>
              </div>

              {/* Calendar months */}
              <div style={{ display: 'flex', gap: isMobile ? 0 : 48 }}>
                <CalendarMonth year={calBase.year} month={calBase.month} checkIn={checkIn} checkOut={checkOut} hoverDate={hoverDate} onDayClick={handleDayClick} onDayHover={setHoverDate} cellSize={cellSize} />
                {!isMobile && (
                  <CalendarMonth year={year2} month={month2} checkIn={checkIn} checkOut={checkOut} hoverDate={hoverDate} onDayClick={handleDayClick} onDayHover={setHoverDate} cellSize={cellSize} />
                )}
              </div>

              {/* Guests */}
              <div style={{ marginTop: isMobile ? 32 : 48 }}>
                <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#C9A96E', marginBottom: 24 }}>Guests</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center' }}>
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: 'rgba(245,240,232,0.6)', cursor: 'pointer', width: 48, height: 48, fontFamily: 'var(--font-jost)', fontSize: 20, transition: 'border-color 0.2s ease, color 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#C9A96E'; (e.currentTarget as HTMLButtonElement).style.color = '#C9A96E' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.6)' }}
                  >−</button>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, fontSize: isMobile ? 56 : 64, color: '#F5F0E8', lineHeight: 1 }}>{guests}</span>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, fontSize: 11, color: 'rgba(245,240,232,0.4)', marginTop: 6 }}>guests</span>
                  </div>
                  <button
                    onClick={() => setGuests(g => Math.min(20, g + 1))}
                    style={{ background: 'transparent', border: '1px solid rgba(201,169,110,0.3)', color: 'rgba(245,240,232,0.6)', cursor: 'pointer', width: 48, height: 48, fontFamily: 'var(--font-jost)', fontSize: 20, transition: 'border-color 0.2s ease, color 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#C9A96E'; (e.currentTarget as HTMLButtonElement).style.color = '#C9A96E' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.6)' }}
                  >+</button>
                </div>
                <p style={{ marginTop: 20, fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, fontSize: 11, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.05em', textAlign: 'center' }}>
                  Maximum capacity 20 guests · Minimum 2 nights
                </p>
              </div>
            </div>

            {/* RIGHT / BOTTOM section: summary + contact + policies */}
            <div style={{ flex: isMobile ? 'none' : '1', minWidth: 0, maxWidth: isMobile ? 'none' : '480px', alignSelf: isMobile ? 'auto' : 'stretch', overflowY: isMobile ? 'visible' : 'auto', maxHeight: isMobile ? 'none' : 'calc(100vh - 120px)', paddingRight: isMobile ? 0 : 8, display: 'flex', flexDirection: 'column', gap: isMobile ? 32 : 40 }}>

              {/* Summary card */}
              {checkIn && checkOut && (
                <div style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', padding: isMobile ? '20px' : '24px 28px', borderRadius: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: isMobile ? 14 : 16, color: '#F5F0E8' }}>{formatShort(checkIn)}</span>
                    <span style={{ color: '#C9A96E', fontSize: 14 }}>→</span>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: isMobile ? 14 : 16, color: '#F5F0E8' }}>{formatShort(checkOut)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(201,169,110,0.2)' }}>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200, fontSize: 12, color: 'rgba(245,240,232,0.5)' }}>
                      {nights} nights · €{PRICE_PER_NIGHT.toLocaleString()}/night
                    </span>
                    <span style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: isMobile ? 14 : 16, color: '#C9A96E' }}>
                      €{(nights * PRICE_PER_NIGHT).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact form */}
              <div>
                <p style={sectionTitle}>Contact details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
                    <div>
                      <label style={labelStyle}>First name</label>
                      <input style={fieldStyle('firstName')} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)} placeholder="—" />
                    </div>
                    <div>
                      <label style={labelStyle}>Last name</label>
                      <input style={fieldStyle('lastName')} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)} placeholder="—" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" style={fieldStyle('email')} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="—" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" style={fieldStyle('phone')} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} placeholder="—" />
                  </div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea style={{ ...fieldStyle('message'), resize: 'none', height: 80 }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} placeholder="—" />
                  </div>
                </div>
              </div>

              {/* Policies accordion */}
              <div>
                <p style={{ ...sectionTitle, marginBottom: 8 }}>Policies</p>
                {POLICIES.map((policy, i) => (
                  <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 48 }}>
                    <button
                      onClick={() => setOpenPolicy(openPolicy === i ? null : i)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: '#F5F0E8', fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 13, letterSpacing: '0.1em', textAlign: 'left' }}
                    >
                      {policy.title}
                      <span style={{ transform: openPolicy === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', fontSize: 11, color: 'rgba(245,240,232,0.4)', flexShrink: 0, marginLeft: 8 }}>▾</span>
                    </button>
                    <AnimatePresence>
                      {openPolicy === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                          <p style={{ fontFamily: 'var(--font-jost)', fontWeight: 200, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, paddingBottom: 16 }}>{policy.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div>
                <button
                  onClick={() => setSubmitted(true)}
                  style={{ width: '100%', height: 56, background: submitted ? 'rgba(245,240,232,0.05)' : 'transparent', border: '1px solid #C9A96E', color: submitted ? '#F5F0E8' : '#C9A96E', fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: 13, letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s ease, color 0.2s ease' }}
                >
                  {submitted ? '✓ Request Sent' : 'Request Availability'}
                </button>
                {submitted && (
                  <p style={{ marginTop: 12, fontFamily: 'var(--font-jost)', fontWeight: 200, fontSize: 13, color: 'rgba(245,240,232,0.6)', textAlign: 'center' }}>
                    We will contact you within 24 hours
                  </p>
                )}
              </div>

            </div>
          </div>
          </div>{/* end centered wrapper */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
