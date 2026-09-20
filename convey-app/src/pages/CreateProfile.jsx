import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isValidPhoneNumber, normalizePhoneNumber } from '../utils/phoneUtils'

export default function CreateProfile() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)

  const { register, login } = useAuth()
  const navigate = useNavigate()

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
    setShowPhotoMenu(false)
  }

  const handleSubmit = async () => {
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }
    if (!isValidPhoneNumber(phone)) {
      setError('Please enter a valid phone number')
      return
    }

    setSubmitting(true)
    const normalized = normalizePhoneNumber(phone)
    const result = await register(name.trim(), normalized, photoPreview)

    if (result.success) {
      navigate('/permissions', { replace: true })
    } else {
      if (result.error.toLowerCase().includes('already registered')) {
        // Fallback to login if account exists
        const loginResult = await login(normalized)
        if (loginResult.success) {
          navigate('/home', { replace: true })
        } else {
          setError(loginResult.error)
        }
      } else {
        setError(result.error)
      }
    }
    setSubmitting(false)
  }

  return (
    <div className="page page--no-nav" style={{ padding: 'var(--space-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)', marginTop: 'var(--space-xl)' }}>
        <h1 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 700,
          background: 'var(--primary-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 'var(--space-sm)'
        }}>
          CONVEY
        </h1>
        <p className="text-secondary">Create your profile</p>
      </div>

      {/* Profile Photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
        <div
          className="avatar avatar--2xl"
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => setShowPhotoMenu(true)}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" />
          ) : (
            <span>👤</span>
          )}
          <div style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 32,
            height: 32,
            background: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: 'var(--primary-text)',
            border: '2px solid var(--bg-primary)'
          }}>
            ＋
          </div>
        </div>
      </div>

      <p className="text-secondary text-center mb-md" style={{ fontSize: 'var(--font-size-sm)' }}>
        Add profile picture
      </p>

      {/* Name Input */}
      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          id="profile-name"
          className="form-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />
      </div>

      {/* Phone Input */}
      <div className="form-group">
        <label className="form-label">Phone number</label>
        <input
          id="profile-phone"
          className="form-input"
          type="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={15}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p style={{
          color: 'var(--accent-red)',
          fontSize: 'var(--font-size-sm)',
          textAlign: 'center',
          marginBottom: 'var(--space-md)'
        }}>
          {error}
        </p>
      )}

      {/* Continue Button */}
      <button
        id="profile-continue"
        className={`btn btn--primary btn--full ${submitting ? 'btn--disabled' : ''}`}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Creating profile...' : 'Continue'}
      </button>

      {/* Photo Menu */}
      {showPhotoMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowPhotoMenu(false)} />
          <div className="menu">
            <p style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 600 }}>
              Choose profile picture
            </p>
            <label className="menu__item">
              <span className="menu__item__icon">📷</span>
              Camera
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} hidden />
            </label>
            <label className="menu__item">
              <span className="menu__item__icon">🖼</span>
              Gallery
              <input type="file" accept="image/*" onChange={handlePhotoSelect} hidden />
            </label>
            <div className="menu__item" onClick={() => setShowPhotoMenu(false)}>
              <span className="menu__item__icon">❌</span>
              Cancel
            </div>
          </div>
        </>
      )}
    </div>
  )
}
