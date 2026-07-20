import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — traces circuit animées (PCB glow)
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

    const makePath = () => {
      const pts = []
      let x = Math.random() < 0.5 ? -20 : W + 20
      let y = Math.random() * H
      pts.push({ x, y })
      const steps = mobile ? 4 + Math.floor(Math.random() * 3) : 6 + Math.floor(Math.random() * 5)
      for (let i = 0; i < steps; i++) {
        if (Math.random() > 0.45) x += (Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 140)
        else y += (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 120)
        x = Math.max(-40, Math.min(W + 40, x))
        y = Math.max(-40, Math.min(H + 40, y))
        pts.push({ x, y })
      }
      return {
        pts,
        progress: Math.random(),
        speed: 0.08 + Math.random() * 0.12,
        green: Math.random() > 0.45,
        width: 1.2 + Math.random() * 1.2,
      }
    }

    let paths = []
    const nodes = []

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
      const n = mobile ? 5 : 10
      paths = Array.from({ length: n }, makePath)
      nodes.length = 0
      for (let i = 0; i < (mobile ? 8 : 16); i++) {
        nodes.push({
          x: 0.1 + Math.random() * 0.8,
          y: 0.1 + Math.random() * 0.8,
          ph: Math.random() * Math.PI * 2,
          green: Math.random() > 0.5,
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const pathLen = (pts) => {
      let L = 0
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x
        const dy = pts[i].y - pts[i - 1].y
        L += Math.sqrt(dx * dx + dy * dy)
      }
      return L || 1
    }

    const pointAt = (pts, p) => {
      const total = pathLen(pts)
      let target = p * total
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x
        const dy = pts[i].y - pts[i - 1].y
        const seg = Math.sqrt(dx * dx + dy * dy)
        if (target <= seg) {
          const k = seg ? target / seg : 0
          return {
            x: pts[i - 1].x + dx * k,
            y: pts[i - 1].y + dy * k,
          }
        }
        target -= seg
      }
      return pts[pts.length - 1]
    }

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      if (!reduce) t += 0.016

      // Fond
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, 'rgba(0, 35, 55, 0.35)')
      bg.addColorStop(0.5, 'rgba(4, 11, 20, 0.1)')
      bg.addColorStop(1, 'rgba(0, 45, 40, 0.28)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Traces circuit
      for (const path of paths) {
        if (!reduce) {
          path.progress += path.speed * 0.016
          if (path.progress > 1.4) {
            Object.assign(path, makePath())
            path.progress = 0
          }
        }

        const drawUntil = Math.min(1, path.progress)
        const total = pathLen(path.pts)
        let drawn = 0
        const target = drawUntil * total

        ctx.beginPath()
        ctx.moveTo(path.pts[0].x, path.pts[0].y)
        for (let i = 1; i < path.pts.length; i++) {
          const dx = path.pts[i].x - path.pts[i - 1].x
          const dy = path.pts[i].y - path.pts[i - 1].y
          const seg = Math.sqrt(dx * dx + dy * dy)
          if (drawn + seg <= target) {
            ctx.lineTo(path.pts[i].x, path.pts[i].y)
            drawn += seg
          } else {
            const k = (target - drawn) / (seg || 1)
            ctx.lineTo(
              path.pts[i - 1].x + dx * k,
              path.pts[i - 1].y + dy * k,
            )
            break
          }
        }

        ctx.strokeStyle = path.green
          ? 'rgba(43, 255, 154, 0.22)'
          : 'rgba(0, 207, 255, 0.25)'
        ctx.lineWidth = path.width
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.stroke()

        // Tête lumineuse
        if (drawUntil > 0.02 && drawUntil < 1.05) {
          const tip = pointAt(path.pts, Math.min(1, drawUntil))
          const g = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 18)
          if (path.green) {
            g.addColorStop(0, 'rgba(43, 255, 154, 0.7)')
            g.addColorStop(1, 'rgba(43, 255, 154, 0)')
          } else {
            g.addColorStop(0, 'rgba(0, 207, 255, 0.7)')
            g.addColorStop(1, 'rgba(0, 207, 255, 0)')
          }
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(tip.x, tip.y, 18, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = path.green ? '#2BFF9A' : '#00CFFF'
          ctx.fill()
        }

        // Coudes (pads)
        for (let i = 0; i < path.pts.length; i++) {
          const along = i / (path.pts.length - 1 || 1)
          if (along > drawUntil) break
          const p = path.pts[i]
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = path.green
            ? 'rgba(43, 255, 154, 0.35)'
            : 'rgba(0, 207, 255, 0.4)'
          ctx.fill()
          ctx.strokeStyle = path.green
            ? 'rgba(43, 255, 154, 0.5)'
            : 'rgba(0, 207, 255, 0.55)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Nœuds fixes qui pulsent
      for (const n of nodes) {
        const px = n.x * W
        const py = n.y * H
        const pulse = 0.4 + Math.sin(t * 2 + n.ph) * 0.35
        const g = ctx.createRadialGradient(px, py, 0, px, py, 22)
        if (n.green) {
          g.addColorStop(0, `rgba(43, 255, 154, ${0.25 * pulse})`)
          g.addColorStop(1, 'rgba(43, 255, 154, 0)')
        } else {
          g.addColorStop(0, `rgba(0, 207, 255, ${0.25 * pulse})`)
          g.addColorStop(1, 'rgba(0, 207, 255, 0)')
        }
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, 22, 0, Math.PI * 2)
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
