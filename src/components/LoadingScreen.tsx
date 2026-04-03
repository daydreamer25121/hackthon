import './LoadingScreen.css'

export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-screen__inner">
        <div className="loading-screen__logo" aria-hidden="true">
          <span className="loading-screen__logo-a">a</span>
        </div>
        <p className="loading-screen__tagline">Shop. Ship. Smile.</p>
        <div className="loading-screen__bar">
          <div className="loading-screen__bar-fill" />
        </div>
        <span className="loading-screen__sr-only">Loading store…</span>
      </div>
    </div>
  )
}
