import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — radar / ondes sonar
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
    let mx = 0.5
    let my = 0.55

    const blips = Array.from({ length: mobile ? 6 : 12 }, () => ({
      a: Math.random() * Math.PI * 2,
      d: 0.15 + Math.random() * 0.7,
      ph: Math.random() * Math.PI * 2,
      green: Math.random() > 0.5,
    }))

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      mx = e.clientX / W
      my = e.clientY / H
    }
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (!touch && !reduce) window.addEventListener('mousemove', onMove)

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      if (!reduce) t += 0.016

      const cx = W * (0.5 + (mx - 0.5) * 0.08)
      const cy = H * (0.58 + (my - 0.5) * 0.06)
      const maxR = Math.hypot(W, H) * 0.55

      // Fond
      const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxR)
      bg.addColorStop(0, 'rgba(0, 60, 80, 0.4)')
      bg.addColorStop(0.5, 'rgba(0, 30, 45, 0.15)')
      bg.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Cercles radar fixes
      const rings = mobile ? 4 : 6
      for (let i = 1; i <= rings; i++) {
        const r = (i / rings) * maxR * 0.85
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = i % 2 === 0
          ? 'rgba(43, 255, 154, 0.1)'
          : 'rgba(0, 207, 255, 0.12)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Croix
      ctx.beginPath()
      ctx.moveTo(cx - maxR * 0.9, cy)
      ctx.lineTo(cx + maxR * 0.9, cy)
      ctx.moveTo(cx, cy - maxR * 0.9)
      ctx.lineTo(cx, cy + maxR * 0.9)
      ctx.strokeStyle = 'rgba(0, 207, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Ondes qui s’étendent
      if (!reduce) {
        for (let i = 0; i < 3; i++) {
          const k = ((t * 0.35 + i / 3) % 1)
          const r = k * maxR
          const a = (1 - k) * 0.45
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.strokeStyle = i % 2 === 0
            ? `rgba(0, 207, 255, ${a})`
            : `rgba(43, 255, 154, ${a})`
          ctx.lineWidth = 2.5
          ctx.stroke()
        }
      }

      // Balayage radar (secteur)
      if (!reduce) {
        const sweep = (t * 1.1) % (Math.PI * 2)
        const grad = ctx.createConicGradient(sweep, cx, cy)
        // conicGradient may need fallback - use wedge path instead for compatibility
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(sweep)
        const wedge = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR * 0.9)
        wedge.addColorStop(0, 'rgba(0, 207, 255, 0.2)')
        wedge.addColorStop(1, 'rgba(0, 207, 255, 0)')
        ctx.fillStyle = wedge
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, maxR * 0.9, -0.35, 0.05)
        ctx.closePath()
        ctx.fill()

        // Ligne de balayage
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(maxR * 0.9, 0)
        ctx.strokeStyle = 'rgba(0, 207, 255, 0.55)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      }

      // Blips
      for (const b of blips) {
        const pulse = 0.5 + Math.sin(t * 2.5 + b.ph) * 0.5
        const x = cx + Math.cos(b.a + t * 0.05) * b.d * maxR * 0.75
        const y = cy + Math.sin(b.a + t * 0.05) * b.d * maxR * 0.75
        const g = ctx.createRadialGradient(x, y, 0, x, y, 16)
        if (b.green) {
          g.addColorStop(0, `rgba(43, 255, 154, ${0.55 * pulse})`)
          g.addColorStop(1, 'rgba(43, 255, 154, 0)')
        } else {
          g.addColorStop(0, `rgba(0, 207, 255, ${0.55 * pulse})`)
          g.addColorStop(1, 'rgba(0, 207, 255, 0)')
        }
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 16, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = b.green ? '#2BFF9A' : '#00CFFF'
        ctx.fill()
      }

      // Centre
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#00CFFF'
      ctx.fill()

      animId = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
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
