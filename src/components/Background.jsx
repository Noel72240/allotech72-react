import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — rubans fluides (liquid ribbons)
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

    const ribbons = mobile
      ? [
          { y: 0.25, amp: 40, freq: 0.003, sp: 0.6, green: false, thick: 90 },
          { y: 0.55, amp: 50, freq: 0.0025, sp: -0.45, green: true, thick: 110 },
          { y: 0.8, amp: 35, freq: 0.0035, sp: 0.35, green: false, thick: 80 },
        ]
      : [
          { y: 0.18, amp: 55, freq: 0.0028, sp: 0.55, green: false, thick: 120 },
          { y: 0.4, amp: 70, freq: 0.0022, sp: -0.4, green: true, thick: 140 },
          { y: 0.62, amp: 50, freq: 0.003, sp: 0.48, green: false, thick: 110 },
          { y: 0.85, amp: 60, freq: 0.0024, sp: -0.32, green: true, thick: 130 },
        ]

    const dots = Array.from({ length: mobile ? 12 : 24 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2,
      ph: Math.random() * Math.PI * 2,
      green: Math.random() > 0.5,
    }))

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drawRibbon = (r) => {
      const baseY = r.y * H
      const phase = reduce ? 0 : t * r.sp

      ctx.beginPath()
      for (let x = 0; x <= W; x += 6) {
        const y =
          baseY +
          Math.sin(x * r.freq + phase) * r.amp +
          Math.sin(x * r.freq * 1.7 + phase * 1.3) * (r.amp * 0.35)
        if (x === 0) ctx.moveTo(x, y - r.thick / 2)
        else ctx.lineTo(x, y - r.thick / 2)
      }
      for (let x = W; x >= 0; x -= 6) {
        const y =
          baseY +
          Math.sin(x * r.freq + phase) * r.amp +
          Math.sin(x * r.freq * 1.7 + phase * 1.3) * (r.amp * 0.35)
        ctx.lineTo(x, y + r.thick / 2)
      }
      ctx.closePath()

      const g = ctx.createLinearGradient(0, baseY - r.thick, 0, baseY + r.thick)
      if (r.green) {
        g.addColorStop(0, 'rgba(43, 255, 154, 0)')
        g.addColorStop(0.5, 'rgba(43, 255, 154, 0.11)')
        g.addColorStop(1, 'rgba(43, 255, 154, 0)')
      } else {
        g.addColorStop(0, 'rgba(0, 207, 255, 0)')
        g.addColorStop(0.5, 'rgba(0, 207, 255, 0.13)')
        g.addColorStop(1, 'rgba(0, 207, 255, 0)')
      }
      ctx.fillStyle = g
      ctx.fill()

      // Ligne centrale brillante
      ctx.beginPath()
      for (let x = 0; x <= W; x += 6) {
        const y =
          baseY +
          Math.sin(x * r.freq + phase) * r.amp +
          Math.sin(x * r.freq * 1.7 + phase * 1.3) * (r.amp * 0.35)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = r.green
        ? 'rgba(43, 255, 154, 0.28)'
        : 'rgba(0, 207, 255, 0.32)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      if (!reduce) t += 0.016

      // Glow ambiant
      const amb = ctx.createRadialGradient(
        W * 0.5,
        H * (0.45 + Math.sin(t * 0.2) * 0.05),
        40,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.7,
      )
      amb.addColorStop(0, 'rgba(0, 70, 95, 0.3)')
      amb.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = amb
      ctx.fillRect(0, 0, W, H)

      for (const r of ribbons) drawRibbon(r)

      // Points flottants
      for (const d of dots) {
        const px = d.x * W + Math.sin(t * 0.5 + d.ph) * 20
        const py = d.y * H + Math.cos(t * 0.4 + d.ph) * 16
        const a = 0.25 + Math.sin(t * 2 + d.ph) * 0.2
        ctx.beginPath()
        ctx.arc(px, py, d.r, 0, Math.PI * 2)
        ctx.fillStyle = d.green
          ? `rgba(43, 255, 154, ${a})`
          : `rgba(0, 207, 255, ${a})`
        ctx.fill()
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
    <>
      <div id="aurora" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
      </div>
      <canvas
        id="bgc"
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
    </>
  )
}
