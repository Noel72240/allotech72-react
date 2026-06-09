/** ID de mesure GA4 — à définir dans Vercel / .env : VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX */
export const GA_MEASUREMENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID?.trim()) || ''

export const ANALYTICS_ENABLED = Boolean(GA_MEASUREMENT_ID)

let scriptLoaded = false
let consentDefaultsSet = false

function gtag() {
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

/** Consent Mode v2 — refus par défaut, puis mise à jour selon le bandeau cookies. */
export function ensureConsentDefaults() {
  if (!ANALYTICS_ENABLED || consentDefaultsSet) return
  window.gtag = window.gtag || function gtagFn() { window.dataLayer.push(arguments) }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })
  consentDefaultsSet = true
}

export function updateAnalyticsConsent(granted) {
  if (!ANALYTICS_ENABLED) return
  ensureConsentDefaults()
  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

export function initAnalytics() {
  if (!ANALYTICS_ENABLED || scriptLoaded) return Promise.resolve()

  ensureConsentDefaults()

  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)
    if (existing) {
      scriptLoaded = true
      resolve()
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    script.onload = () => {
      gtag('js', new Date())
      gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      })
      scriptLoaded = true
      resolve()
    }
    script.onerror = () => resolve()
    document.head.appendChild(script)
  })
}

export function trackPageView(path) {
  if (!ANALYTICS_ENABLED || !scriptLoaded) return
  const pagePath = path || window.location.pathname + window.location.search
  gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  })
}
