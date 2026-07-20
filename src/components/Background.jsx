import { useEffect, useRef } from 'react'

/**
 * Fond Allotech72 — pluie Matrix (caractères qui tombent)
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
    let columns = []
    let fontSize = mobile ? 14 : 16

    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGH<>{}[]#$%&@'

    const resize = () => {
      W = cvs.width = window.innerWidth
      H = cvs.height = window.innerHeight
      fontSize = mobile ? 14 : 16
      const cols = Math.ceil(W / fontSize)
      columns = Array.from({ length: cols }, () => ({
        y: Math.random() * H,
        speed: 2 + Math.random() * (mobile ? 3 : 5),
        green: Math.random() > 0.55,
        len: 8 + Math.floor(Math.random() * 14),
      }))
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = () => {
      // Traînée (fondu) pour effet pluie
      ctx.fillStyle = 'rgba(4, 11, 20, 0.18)'
      ctx.fillRect(0, 0, W, H)

      // Halo doux derrière
      const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 40, W * 0.5, H * 0.4, Math.max(W, H) * 0.6)
      g.addColorStop(0, 'rgba(0, 50, 70, 0.12)')
      g.addColorStop(1, 'rgba(4, 11, 20, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]
        const x = i * fontSize + fontSize / 2

        if (!reduce) col.y += col.speed

        for (let j = 0; j < col.len; j++) {
          const y = col.y - j * fontSize
          if (y < -fontSize || y > H + fontSize) continue
          const ch = chars[Math.floor(Math.random() * chars.length)]
          const head = j === 0
          const fade = 1 - j / col.len

          if (head) {
            ctx.fillStyle = '#e8ffff'
            ctx.shadowColor = col.green ? '#2BFF9A' : '#00CFFF'
            ctx.shadowBlur = 12
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = col.green
              ? `rgba(43, 255, 154, ${0.15 + fade * 0.45})`
              : `rgba(0, 207, 255, ${0.15 + fade * 0.5})`
          }
          ctx.fillText(ch, x, y)
        }
        ctx.shadowBlur = 0

        if (col.y - col.len * fontSize > H) {
          col.y = -Math.random() * H * 0.3
          col.speed = 2 + Math.random() * (mobile ? 3 : 5)
          col.green = Math.random() > 0.55
          col.len = 8 + Math.floor(Math.random() * 14)
        }
      }

      if (reduce) {
        // figé : une seule couche légère
        cancelAnimationFrame(animId)
        return
      }

      animId = requestAnimationFrame(frame)
    }

    // Fond opaque initial
    ctx.fillStyle = '#040B14'
    ctx.fillRect(0, 0, W, H)
    frame()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div id="aurora" aria-hidden="true" style={{ opacity: 0.35 }}>
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
