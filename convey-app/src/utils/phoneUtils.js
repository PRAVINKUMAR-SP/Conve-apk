/**
 * Normalize a phone number to E.164 format.
 * Removes spaces, dashes, parentheses. Adds +91 if no country code.
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return ''
  let cleaned = phone.replace(/[\s\-()]/g, '')
  if (!cleaned.startsWith('+')) {
    // Default to India country code
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    cleaned = '+91' + cleaned
  }
  return cleaned
}

/**
 * Format a phone number for display.
 */
export function formatPhoneNumber(phone) {
  if (!phone) return ''
  // Simple formatting: +91 XXXXX XXXXX
  if (phone.startsWith('+91') && phone.length === 13) {
    return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`
  }
  return phone
}

/**
 * Validate a phone number (basic check).
 */
export function isValidPhoneNumber(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  // Allow 10-15 digits with optional + prefix
  return /^\+?\d{10,15}$/.test(cleaned)
}
