import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — faisceaux néon + orbes (très visible, sans hexagones)
 * Hex sauvegardé : BackgroundHex.jsx
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

    const beams = mobile
      ? [
          { x: 0.2, w: 90, sp: 0.35, green: false },
          { x: 0.55, w: 70, sp: -0.28, green: true },
          { x: 0.82, w: 60, sp: 0.22, green: false },
        ]
      : [
          { x: 0.12, w: 110, sp: 0.4, green: false },
          { x: 0.38, w: 80, sp: -0.32, green: true },
          { x: 0.62, w: 100, sp: 0.26, green: false },
          { x: 0.88, w: 70, sp: -0.2, green: true },
        ]

    const orbs = Array.from({ length: mobile ? 6 : 12 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: mobile ? 50 + Math.random() * 60 : 80 + Math.random() * 120,
      ph: Math.random() * Math.PI * 2,
      sp: 0.2 + Math.random() * 0.35,
      green: i % 2 === 0,
    }))

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      if (!reduce) t += 0.016

      // Fond dégradé animé (très lisible)
      const gx = 0.5 + Math.sin(t * 0.25) * 0.15
      const gy = 0.35 + Math.cos(t * 0.2) * 0.1
      const bg = ctx.createRadialGradient(W * gx, H * gy, 20, W * 0.5, H * 0.5, Math.max(W, H) * 0.85)
      bg.addColorStop(0, 'rgba(0, 90, 120, 0.35)')
      bg.addColorStop(0.35, 'rgba(0, 40, 55, 0.18)')
      bg.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Faisceaux verticaux néon
      for (const b of beams) {
        const drift = reduce ? 0 : Math.sin(t * b.sp) * 0.04
        const x = (b.x + drift) * W
        const g = ctx.createLinearGradient(x - b.w, 0, x + b.w, 0)
        if (b.green) {
          g.addColorStop(0, 'rgba(43, 255, 154, 0)')
          g.addColorStop(0.5, `rgba(43, 255, 154, ${0.14 + Math.sin(t * 1.2 + b.x) * 0.05})`)
          g.addColorStop(1, 'rgba(43, 255, 154, 0)')
        } else {
          g.addColorStop(0, 'rgba(0, 207, 255, 0)')
          g.addColorStop(0.5, `rgba(0, 207, 255, ${0.16 + Math.sin(t * 1.1 + b.x) * 0.05})`)
          g.addColorStop(1, 'rgba(0, 207, 255, 0)')
        }
        ctx.fillStyle = g
        ctx.fillRect(x - b.w, 0, b.w * 2, H)

        // Ligne centrale du faisceau
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.strokeStyle = b.green
          ? 'rgba(43, 255, 154, 0.22)'
          : 'rgba(0, 207, 255, 0.25)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Balayage horizontal
      if (!reduce) {
        const y = ((t * 40) % (H + 100)) - 50
        const scan = ctx.createLinearGradient(0, y - 50, 0, y + 50)
        scan.addColorStop(0, 'rgba(0, 207, 255, 0)')
        scan.addColorStop(0.5, 'rgba(0, 207, 255, 0.12)')
        scan.addColorStop(1, 'rgba(43, 255, 154, 0)')
        ctx.fillStyle = scan
        ctx.fillRect(0, y - 50, W, 100)
      }

      // Grosses orbes
      for (const o of orbs) {
        const px = o.x * W + Math.sin(t * o.sp + o.ph) * (mobile ? 40 : 70)
        const py = o.y * H + Math.cos(t * o.sp * 0.8 + o.ph) * (mobile ? 30 : 50)
        const pulse = 0.7 + Math.sin(t * 1.4 + o.ph) * 0.3
        const g = ctx.createRadialGradient(px, py, 0, px, py, o.r)
        if (o.green) {
          g.addColorStop(0, `rgba(43, 255, 154, ${0.22 * pulse})`)
          g.addColorStop(0.4, `rgba(43, 255, 154, ${0.08 * pulse})`)
        } else {
          g.addColorStop(0, `rgba(0, 207, 255, ${0.24 * pulse})`)
          g.addColorStop(0.4, `rgba(0, 174, 239, ${0.09 * pulse})`)
        }
        g.addColorStop(1, 'rgba(4, 11, 20, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, o.r, 0, Math.PI * 2)
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

  // Aurora CSS allégée — pas de hex
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
