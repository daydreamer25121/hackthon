import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import type { UserRole } from '../auth/AuthContext'
import { useAuth } from '../auth/AuthContext'
import './Login.css'

export function LoginPage() {
  const { role } = useParams<{ role: string }>()
  const loginRole: UserRole | null =
    role === 'user' || role === 'seller' ? role : null
  const { login, register, session } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loginRole) return <Navigate to="/login" replace />

  if (session?.role === loginRole) {
    return <Navigate to={loginRole === 'seller' ? '/seller' : '/'} replace />
  }

  const title =
    mode === 'login'
      ? loginRole === 'seller'
        ? 'Seller sign in'
        : 'Welcome back'
      : loginRole === 'seller'
        ? 'Create seller account'
        : 'Create user account'
  const subtitle =
    loginRole === 'seller'
      ? 'Manage your listings and orders from one place.'
      : 'Sign in to shop, view your cart, and place orders.'

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.')
      return
    }
    if (mode === 'register' && !name.trim()) {
      setError('Please enter your name.')
      return
    }
    try {
      setBusy(true)
      if (mode === 'login') {
        await login({ role: loginRole, email, password })
      } else {
        await register({ role: loginRole, name, email, password })
      }
      if (loginRole === 'user') {
        navigate('/', { replace: true })
      } else {
        navigate('/seller', { replace: true })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-shell login-shell--split">
      <aside className="login-hero" aria-hidden>
        <div className="login-hero__content">
          <div className="login-hero__logo">a</div>
          <h1 className="login-hero__title">
            {loginRole === 'seller' ? 'Seller hub' : 'Your store'}
          </h1>
          <p className="login-hero__text">{subtitle}</p>
        </div>
      </aside>

      <div className="login-panel">
        <div className="login-panel__inner">
          <Link to="/login" className="login-back">
            ← Back to roles
          </Link>

          <div className="login-card">
            <span className="login-card__badge">
              {loginRole === 'seller' ? 'Seller' : 'Customer'}
            </span>
            <h2 className="login-card__title">{title}</h2>

            <form className="login-form" onSubmit={onSubmit} noValidate>
              {mode === 'register' && (
                <label className="login-label" htmlFor="login-name">
                  Name
                  <input
                    id="login-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="login-input"
                    placeholder="Your name"
                  />
                </label>
              )}

              <label className="login-label" htmlFor="login-email">
                Email
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="you@example.com"
                />
              </label>

              <label className="login-label" htmlFor="login-password">
                Password
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                />
              </label>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="login-submit" disabled={busy}>
                {busy
                  ? 'Please wait...'
                  : mode === 'login'
                    ? loginRole === 'seller'
                      ? 'Sign in to seller panel'
                      : 'Sign in & shop'
                    : 'Create account'}
              </button>
            </form>

            <p className="login-alt">
              {mode === 'login' ? (
                <button
                  type="button"
                  className="login-mode-btn"
                  onClick={() => setMode('register')}
                >
                  Register new {loginRole}
                </button>
              ) : (
                <button
                  type="button"
                  className="login-mode-btn"
                  onClick={() => setMode('login')}
                >
                  Already have an account? Sign in
                </button>
              )}
            </p>
            <p className="login-alt">
              <Link to="/">Return to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
