export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ background: '#1A1612', color: '#F5F0E8', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 300, letterSpacing: '0.1em', margin: 0 }}>404</h1>
          <p style={{ fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>Page not found</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '2rem', color: '#C9A96E', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', textDecoration: 'none' }}>Return to Villa Aura</a>
        </div>
      </body>
    </html>
  )
}
