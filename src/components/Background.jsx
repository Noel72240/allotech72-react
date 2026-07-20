import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — champ d’étoiles + étoiles filantes
 * (distinct des faisceaux / hex / orbites)
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

    const starCount = mobile ? 70 : 160
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      tw: Math.random() * Math.PI * 2,
      green: Math.random() > 0.62,
    }))

    const shooters = []
    let shootTimer = 0

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnShooter = () => {
      if (reduce) return
      shooters.push({
        x: Math.random() * W * 0.9,
        y: Math.random() * H * 0.45,
        len: 60 + Math.random() * 100,
        sp: 6 + Math.random() * 8,
        ang: Math.PI * 0.15 + Math.random() * 0.25,
        life: 0,
        max: 0.7 + Math.random() * 0.5,
        green: Math.random() > 0.5,
      })
    }

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      if (!reduce) t += 0.016

      // Nébuleuse douce
      const n1 = ctx.createRadialGradient(
        W * (0.25 + Math.sin(t * 0.15) * 0.05),
        H * 0.3,
        0,
        W * 0.25,
        H * 0.3,
        Math.max(W, H) * 0.45,
      )
      n1.addColorStop(0, 'rgba(0, 100, 140, 0.28)')
      n1.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = n1
      ctx.fillRect(0, 0, W, H)

      const n2 = ctx.createRadialGradient(
        W * (0.75 + Math.cos(t * 0.12) * 0.05),
        H * 0.65,
        0,
        W * 0.75,
        H * 0.65,
        Math.max(W, H) * 0.4,
      )
      n2.addColorStop(0, 'rgba(20, 90, 60, 0.22)')
      n2.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = n2
      ctx.fillRect(0, 0, W, H)

      // Étoiles
      for (const s of stars) {
        const tw = 0.35 + Math.sin(t * 2.2 + s.tw) * 0.3
        const r = (0.6 + s.z * 1.6) * (mobile ? 0.85 : 1)
        const x = s.x * W
        const y = s.y * H
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = s.green
          ? `rgba(43, 255, 154, ${tw * s.z})`
          : `rgba(0, 207, 255, ${tw * s.z})`
        ctx.fill()

        if (s.z > 0.75 && !mobile) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5)
          g.addColorStop(0, s.green
            ? `rgba(43, 255, 154, ${0.12 * tw})`
            : `rgba(0, 207, 255, ${0.12 * tw})`)
          g.addColorStop(1, 'rgba(4, 11, 20, 0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, r * 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Étoiles filantes
      if (!reduce) {
        shootTimer += 0.016
        if (shootTimer > (mobile ? 2.2 : 1.4)) {
          shootTimer = 0
          spawnShooter()
        }
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        s.life += 0.016
        s.x += Math.cos(s.ang) * s.sp
        s.y += Math.sin(s.ang) * s.sp
        const k = s.life / s.max
        if (k >= 1) {
          shooters.splice(i, 1)
          continue
        }
        const alpha = (1 - k) * 0.7
        const tx = s.x - Math.cos(s.ang) * s.len
        const ty = s.y - Math.sin(s.ang) * s.len
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y)
        if (s.green) {
          g.addColorStop(0, 'rgba(43, 255, 154, 0)')
          g.addColorStop(1, `rgba(43, 255, 154, ${alpha})`)
        } else {
          g.addColorStop(0, 'rgba(0, 207, 255, 0)')
          g.addColorStop(1, `rgba(0, 207, 255, ${alpha})`)
        }
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = s.green ? `rgba(43, 255, 154, ${alpha})` : `rgba(0, 207, 255, ${alpha})`
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
