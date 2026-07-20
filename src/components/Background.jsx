import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 actif — anneaux orbitaux + nœuds lumineux
 * Version hexagonale sauvegardée : BackgroundHex.jsx (à réactiver sur demande)
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
    let my = 0.5

    const rings = mobile
      ? [
          { r: 0.18, nodes: 4, sp: 0.18, green: false },
          { r: 0.32, nodes: 6, sp: -0.12, green: true },
          { r: 0.48, nodes: 8, sp: 0.08, green: false },
        ]
      : [
          { r: 0.16, nodes: 5, sp: 0.22, green: false },
          { r: 0.28, nodes: 7, sp: -0.14, green: true },
          { r: 0.42, nodes: 9, sp: 0.1, green: false },
          { r: 0.58, nodes: 11, sp: -0.07, green: true },
        ]

    const sparks = Array.from({ length: mobile ? 18 : 36 }, () => ({
      a: Math.random() * Math.PI * 2,
      d: 0.1 + Math.random() * 0.7,
      s: 0.002 + Math.random() * 0.006,
      sz: 0.6 + Math.random() * 1.4,
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

      const cx = W * (0.5 + (mx - 0.5) * 0.06)
      const cy = H * (0.42 + (my - 0.5) * 0.05)
      const base = Math.min(W, H)

      // Halo central
      const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, base * 0.55)
      halo.addColorStop(0, 'rgba(0, 207, 255, 0.1)')
      halo.addColorStop(0.4, 'rgba(43, 255, 154, 0.04)')
      halo.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, W, H)

      // Étoiles / étincelles en orbite lente
      for (const s of sparks) {
        if (!reduce) s.a += s.s
        const x = cx + Math.cos(s.a) * s.d * base * 0.7
        const y = cy + Math.sin(s.a) * s.d * base * 0.55
        ctx.beginPath()
        ctx.arc(x, y, s.sz, 0, Math.PI * 2)
        ctx.fillStyle = s.green
          ? 'rgba(43, 255, 154, 0.35)'
          : 'rgba(0, 207, 255, 0.35)'
        ctx.fill()
      }

      // Anneaux
      for (const ring of rings) {
        const radius = ring.r * base
        const rot = reduce ? 0 : t * ring.sp

        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = ring.green
          ? 'rgba(43, 255, 154, 0.12)'
          : 'rgba(0, 207, 255, 0.14)'
        ctx.lineWidth = 1.2
        ctx.setLineDash(mobile ? [] : [6, 10])
        ctx.lineDashOffset = reduce ? 0 : -t * 20 * Math.sign(ring.sp || 1)
        ctx.stroke()
        ctx.setLineDash([])

        // Arc lumineux qui tourne
        const arcStart = rot
        ctx.beginPath()
        ctx.arc(cx, cy, radius, arcStart, arcStart + 0.9)
        ctx.strokeStyle = ring.green
          ? 'rgba(43, 255, 154, 0.45)'
          : 'rgba(0, 207, 255, 0.5)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Nœuds
        for (let i = 0; i < ring.nodes; i++) {
          const a = rot + (i / ring.nodes) * Math.PI * 2
          const x = cx + Math.cos(a) * radius
          const y = cy + Math.sin(a) * radius
          const pulse = 0.55 + Math.sin(t * 2 + i) * 0.25

          const g = ctx.createRadialGradient(x, y, 0, x, y, 14)
          if (ring.green) {
            g.addColorStop(0, `rgba(43, 255, 154, ${0.55 * pulse})`)
            g.addColorStop(1, 'rgba(43, 255, 154, 0)')
          } else {
            g.addColorStop(0, `rgba(0, 207, 255, ${0.55 * pulse})`)
            g.addColorStop(1, 'rgba(0, 207, 255, 0)')
          }
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, 14, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(x, y, 2.4, 0, Math.PI * 2)
          ctx.fillStyle = ring.green ? '#2BFF9A' : '#00CFFF'
          ctx.globalAlpha = 0.85
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      // Croisement central discret
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 207, 255, 0.7)'
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

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reduce) return
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      document.querySelectorAll('#aurora .blob').forEach((b, i) => {
        const s = (i + 1) * 10
        b.style.transform = `translate(${x * s}px, ${y * s}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div id="aurora" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <canvas
        id="bgc"
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
    </>
  )
}
