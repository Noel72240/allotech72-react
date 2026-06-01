import { useEffect, useRef, useId } from 'react'
import config from '../../config.js'
import { padMondialRelayBrand } from '../../lib/shipping.js'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Script introuvable : ${src}`))
    document.head.appendChild(s)
  })
}

/**
 * Widget Mondial Relay (jQuery) — sélection d’un point relais.
 * brand : code client MR sur 8 caractères (ex. BDTEST  en test)
 */
export default function MondialRelayPicker({ brand, postCode, onSelect }) {
  const containerId = useId().replace(/:/g, '')
  const targetId = `${containerId}-target`
  const infoId = `${containerId}-info`
  const widgetRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const paddedBrand = padMondialRelayBrand(brand)
    if (!paddedBrand) return undefined

    let cancelled = false

    async function init() {
      try {
        await loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
        await loadScript(
          'https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js',
        )
        if (cancelled || !window.jQuery?.fn?.MR_ParcelShopPicker) return

        const $ = window.jQuery
        const $zone = $(`#${containerId}`)
        $zone.empty()

        $zone.MR_ParcelShopPicker({
          Target: `#${targetId}`,
          TargetDisplayInfoPR: `#${infoId}`,
          Brand: paddedBrand,
          Country: 'FR',
          PostCode: postCode || configDefaultPostCode(),
          ColLivMod: '24R',
          NbResults: '10',
          ShowResultsOnMap: true,
          Responsive: true,
          OnParcelShopSelected: data => {
            if (!data) return
            onSelectRef.current?.({
              id: data.ID || data.Id || '',
              name: data.Nom || data.name || '',
              address: [data.Adresse1, data.Adresse2].filter(Boolean).join(' '),
              postCode: data.CP || data.postCode || '',
              city: data.Ville || data.city || '',
              country: data.Pays || 'FR',
              raw: data,
            })
          },
        })
        widgetRef.current = $zone
      } catch {
        /* widget indisponible — saisie manuelle en fallback */
      }
    }

    init()
    return () => {
      cancelled = true
      try {
        widgetRef.current?.empty?.()
      } catch {
        /* ignore */
      }
    }
  }, [brand, containerId, targetId, infoId, postCode])

  if (!padMondialRelayBrand(brand)) {
    return (
      <p className="cart-sumup-hint">
        Code Mondial Relay non configuré dans l’admin. Indiquez le point relais manuellement ci-dessous.
      </p>
    )
  }

  return (
    <div className="mr-picker-wrap">
      <input type="hidden" id={targetId} readOnly />
      <div id={infoId} className="mr-picker-info" aria-live="polite" />
      <div id={containerId} className="mr-picker-zone" />
    </div>
  )
}

function configDefaultPostCode() {
  return config.codePostal || '72000'
}
