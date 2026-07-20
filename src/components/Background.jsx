import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — aurora / aurore boréale (bandes douces)
 * Hex : BackgroundHex.jsx
 */
export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 950
    let W = 0
    let H = 0
    let animId = 0
    let t = 0

    const bands = mobile
      ? [
          { y: 0.2, h: 0.35, sp: 0.25, green: false },
          { y: 0.55, h: 0.4, sp: -0.2, green: true },
        ]
      : [
          { y: 0.12, h: 0.32, sp: 0.28, green: false },
          { y: 0.38, h: 0.36, sp: -0.22, green: true },
          { y: 0.62, h: 0.34, sp: 0.18, green: false },
          { y: 0.78, h: 0.3, sp: -0.15, green: true },
        ]

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = () => {
      ctx.fillStyle = '#040B14'
      ctx.fillRect(0, 0, W, H)
      if (!reduce) t += 0.012

      for (const b of bands) {
        const phase = reduce ? 0 : t * b.sp
        const baseY = b.y * H
        const height = b.h * H

        // Forme ondulée
        ctx.beginPath()
        ctx.moveTo(0, H)
        for (let x = 0; x <= W; x += 8) {
          const wave =
            Math.sin(x * 0.003 + phase * 2) * 40 +
            Math.sin(x * 0.007 + phase * 1.4) * 22 +
            Math.sin(x * 0.0015 - phase) * 30
          const y = baseY + wave
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        for (let x = W; x >= 0; x -= 8) {
          const wave =
            Math.sin(x * 0.003 + phase * 2) * 40 +
            Math.sin(x * 0.007 + phase * 1.4) * 22 +
            Math.sin(x * 0.0015 - phase) * 30
          ctx.lineTo(x, baseY + wave + height)
        }
        ctx.closePath()

        const g = ctx.createLinearGradient(0, baseY - 80, 0, baseY + height + 80)
        if (b.green) {
          g.addColorStop(0, 'rgba(43, 255, 154, 0)')
          g.addColorStop(0.35, 'rgba(43, 255, 154, 0.2)')
          g.addColorStop(0.55, 'rgba(0, 207, 255, 0.12)')
          g.addColorStop(1, 'rgba(43, 255, 154, 0)')
        } else {
          g.addColorStop(0, 'rgba(0, 207, 255, 0)')
          g.addColorStop(0.35, 'rgba(0, 207, 255, 0.22)')
          g.addColorStop(0.55, 'rgba(43, 255, 154, 0.1)')
          g.addColorStop(1, 'rgba(0, 207, 255, 0)')
        }
        ctx.fillStyle = g
        ctx.fill()
      }

      // Voile central pour lisibilité du texte
      const veil = ctx.createRadialGradient(W * 0.35, H * 0.35, 20, W * 0.4, H * 0.4, Math.max(W, H) * 0.55)
      veil.addColorStop(0, 'rgba(4, 11, 20, 0.15)')
      veil.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = veil
      ctx.fillRect(0, 0, W, H)

      // Quelques points scintillants discrets
      if (!mobile) {
        for (let i = 0; i < 18; i++) {
          const x = ((i * 97) % 100) / 100 * W
          const y = ((i * 53) % 100) / 100 * H
          const a = 0.15 + Math.sin(t * 2 + i) * 0.1
          ctx.beginPath()
          ctx.arc(x, y, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = i % 2 ? `rgba(43,255,154,${a})` : `rgba(0,207,255,${a})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      id="bgc"
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
