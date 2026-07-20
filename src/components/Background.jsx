import { useEffect, useRef } from 'react'

/**
 * Fond animé Allotech72 — aurora fluide + orbes + grille légère
 * (remplace l’ancien réseau de particules)
 */
export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 950
    let W = 0
    let H = 0
    let animId = 0
    let t = 0
    let mouseX = 0.5
    let mouseY = 0.5

    const orbCount = reduceMotion ? 0 : mobile ? 5 : 9
    const orbs = Array.from({ length: orbCount }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: mobile ? 40 + Math.random() * 50 : 70 + Math.random() * 90,
      sp: 0.15 + Math.random() * 0.25,
      ph: Math.random() * Math.PI * 2,
      hue: i % 2 === 0 ? 'cyan' : 'green',
    }))

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (!touch && !reduceMotion) window.addEventListener('mousemove', onMove)

    const drawGrid = (alpha) => {
      if (mobile || reduceMotion) return
      const step = 72
      const ox = (mouseX - 0.5) * 18
      const oy = (mouseY - 0.5) * 12
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.strokeStyle = 'rgba(0, 207, 255, 0.07)'
      ctx.lineWidth = 1
      for (let x = -step; x < W + step; x += step) {
        ctx.beginPath()
        ctx.moveTo(x + ox, 0)
        ctx.lineTo(x + ox, H)
        ctx.stroke()
      }
      for (let y = -step; y < H + step; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y + oy)
        ctx.lineTo(W, y + oy)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawWave = (baseY, amp, freq, speed, color, width) => {
      ctx.beginPath()
      ctx.moveTo(0, H)
      for (let x = 0; x <= W; x += 8) {
        const y =
          baseY +
          Math.sin(x * freq + t * speed) * amp +
          Math.sin(x * freq * 0.45 + t * speed * 0.7) * (amp * 0.35)
        ctx.lineTo(x, y)
      }
      ctx.lineTo(W, H)
      ctx.closePath()
      const g = ctx.createLinearGradient(0, baseY - amp * 2, 0, H)
      g.addColorStop(0, color)
      g.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = g
      ctx.globalAlpha = 1
      ctx.fill()

      ctx.beginPath()
      for (let x = 0; x <= W; x += 8) {
        const y =
          baseY +
          Math.sin(x * freq + t * speed) * amp +
          Math.sin(x * freq * 0.45 + t * speed * 0.7) * (amp * 0.35)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color.replace(/[\d.]+\)$/, '0.22)')
      ctx.lineWidth = width
      ctx.stroke()
    }

    const drawOrbs = () => {
      for (const o of orbs) {
        const px =
          o.x * W +
          Math.sin(t * o.sp + o.ph) * (mobile ? 30 : 55) +
          (mouseX - 0.5) * 20
        const py =
          o.y * H +
          Math.cos(t * o.sp * 0.85 + o.ph) * (mobile ? 24 : 40) +
          (mouseY - 0.5) * 16
        const pulse = 0.55 + Math.sin(t * 0.9 + o.ph) * 0.2
        const grad = ctx.createRadialGradient(px, py, 0, px, py, o.r)
        if (o.hue === 'cyan') {
          grad.addColorStop(0, `rgba(0, 207, 255, ${0.16 * pulse})`)
          grad.addColorStop(0.45, `rgba(0, 174, 239, ${0.06 * pulse})`)
        } else {
          grad.addColorStop(0, `rgba(43, 255, 154, ${0.14 * pulse})`)
          grad.addColorStop(0.45, `rgba(43, 255, 154, ${0.05 * pulse})`)
        }
        grad.addColorStop(1, 'rgba(4, 11, 20, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, o.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawScan = () => {
      if (mobile || reduceMotion) return
      const y = ((t * 28) % (H + 120)) - 60
      const g = ctx.createLinearGradient(0, y - 40, 0, y + 40)
      g.addColorStop(0, 'rgba(0, 207, 255, 0)')
      g.addColorStop(0.5, 'rgba(0, 207, 255, 0.05)')
      g.addColorStop(1, 'rgba(43, 255, 154, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, y - 40, W, 80)
    }

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      if (!reduceMotion) t += 0.012

      drawGrid(0.55)
      drawOrbs()

      if (!reduceMotion) {
        drawWave(
          H * 0.72,
          mobile ? 18 : 28,
          0.0045,
          0.7,
          'rgba(0, 207, 255, 0.05)',
          1.2,
        )
        drawWave(
          H * 0.78,
          mobile ? 14 : 22,
          0.0032,
          0.55,
          'rgba(43, 255, 154, 0.04)',
          1,
        )
      }

      drawScan()
      animId = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  // Parallax blobs — desktop
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reduce) return

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      document.querySelectorAll('#aurora .blob').forEach((b, i) => {
        const s = (i + 1) * 14
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
        <div className="blob b4" />
      </div>
      <canvas
        id="bgc"
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
    </>
  )
}
