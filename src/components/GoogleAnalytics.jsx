import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useCookies } from '../hooks/useCookies.jsx'
import {
  ANALYTICS_ENABLED,
  initAnalytics,
  trackPageView,
  updateAnalyticsConsent,
} from '../lib/analytics.js'

/** Charge GA4 après consentement cookies + envoie les pages vues (SPA). */
export default function GoogleAnalytics() {
  const { consent } = useCookies()
  const location = useLocation()
  const ready = useRef(false)

  useEffect(() => {
    if (!ANALYTICS_ENABLED || consent === undefined) return

    const granted = consent?.analytics === true
    updateAnalyticsConsent(granted)

    if (!granted) {
      ready.current = false
      return
    }

    initAnalytics().then(() => {
      ready.current = true
      trackPageView(location.pathname + location.search)
    })
  }, [consent])

  useEffect(() => {
    if (!ANALYTICS_ENABLED || !consent?.analytics || !ready.current) return
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search, consent?.analytics])

  return null
}
