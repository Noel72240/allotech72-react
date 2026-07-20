import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — grille hexagonale + impulsions (version validee)
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

    const size = mobile ? 38 : 46
    const h = size * Math.sqrt(3)
    const pulses = []
    const trails = []

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

    const hexPath = (cx, cy, r) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
    }

    const spawnPulse = () => {
      if (reduce) return
      const cols = Math.ceil(W / (size * 1.5)) + 2
      const rows = Math.ceil(H / h) + 2
      const c = Math.floor(Math.random() * cols)
      const r = Math.floor(Math.random() * rows)
      const odd = r % 2
      pulses.push({
        x: c * size * 1.5 + (odd ? size * 0.75 : 0),
        y: r * h * 0.5,
        life: 0,
        max: 1.4 + Math.random() * 0.8,
        green: Math.random() > 0.45,
      })
    }

    const spawnTrail = () => {
      if (reduce || mobile) return
      trails.push({
        x: Math.random() * W,
        y: -20,
        len: 40 + Math.random() * 90,
        sp: 1.6 + Math.random() * 2.4,
        a: 0.15 + Math.random() * 0.2,
        green: Math.random() > 0.5,
      })
    }

    let pulseTimer = 0
    let trailTimer = 0

    const drawHexGrid = () => {
      const ox = (mx - 0.5) * 22
      const oy = (my - 0.5) * 14
      const cols = Math.ceil(W / (size * 1.5)) + 3
      const rows = Math.ceil(H / (h * 0.5)) + 3

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const odd = row % 2 !== 0
          const cx = col * size * 1.5 + (odd ? size * 0.75 : 0) + ox
          const cy = row * h * 0.5 + oy
          const dx = cx / W - mx
          const dy = cy / H - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const glow = Math.max(0, 1 - dist * 2.2)
          const breath = 0.035 + Math.sin(t * 0.8 + col * 0.3 + row * 0.2) * 0.015

          hexPath(cx, cy, size * 0.52)
          ctx.strokeStyle = `rgba(0, 207, 255, ${breath + glow * 0.08})`
          ctx.lineWidth = 1
          ctx.stroke()

          if (glow > 0.55 && !mobile) {
            ctx.fillStyle = `rgba(43, 255, 154, ${glow * 0.035})`
            ctx.fill()
          }
        }
      }
    }

    const drawPulses = () => {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.life += 0.016
        const k = p.life / p.max
        if (k >= 1) {
          pulses.splice(i, 1)
          continue
        }
        const r = size * (0.3 + k * 2.2)
        const alpha = (1 - k) * 0.35
        hexPath(p.x, p.y, r)
        ctx.strokeStyle = p.green
          ? `rgba(43, 255, 154, ${alpha})`
          : `rgba(0, 207, 255, ${alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = p.green
          ? `rgba(43, 255, 154, ${alpha * 1.4})`
          : `rgba(0, 207, 255, ${alpha * 1.4})`
        ctx.fill()
      }
    }

    const drawTrails = () => {
      for (let i = trails.length - 1; i >= 0; i--) {
        const tr = trails[i]
        tr.y += tr.sp
        if (tr.y - tr.len > H) {
          trails.splice(i, 1)
          continue
        }
        const g = ctx.createLinearGradient(tr.x, tr.y - tr.len, tr.x, tr.y)
        if (tr.green) {
          g.addColorStop(0, 'rgba(43, 255, 154, 0)')
          g.addColorStop(1, `rgba(43, 255, 154, ${tr.a})`)
        } else {
          g.addColorStop(0, 'rgba(0, 207, 255, 0)')
          g.addColorStop(1, `rgba(0, 207, 255, ${tr.a})`)
        }
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(tr.x, tr.y - tr.len)
        ctx.lineTo(tr.x, tr.y)
        ctx.stroke()
      }
    }

    const frame = () => {
      ctx.clearRect(0, 0, W, H)

      // Voile de base
      const bg = ctx.createRadialGradient(W * mx, H * my, 40, W * 0.5, H * 0.4, Math.max(W, H) * 0.75)
      bg.addColorStop(0, 'rgba(0, 40, 60, 0.22)')
      bg.addColorStop(0.55, 'rgba(4, 11, 20, 0.05)')
      bg.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      if (!reduce) t += 0.016

      drawHexGrid()
      drawPulses()
      drawTrails()

      if (!reduce) {
        pulseTimer += 0.016
        trailTimer += 0.016
        if (pulseTimer > (mobile ? 1.1 : 0.7)) {
          pulseTimer = 0
          spawnPulse()
          if (!mobile) spawnPulse()
        }
        if (trailTimer > 0.55) {
          trailTimer = 0
          spawnTrail()
        }
      }

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
