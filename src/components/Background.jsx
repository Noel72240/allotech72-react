import { useEffect, useRef } from 'react'

export default function Background() {
  const canvasRef = useRef(null)
  const isMobile  = () => window.innerWidth < 950

  // Particles canvas
  useEffect(() => {
    const cvs = canvasRef.current
    const ctx = cvs.getContext('2d')
    let W, H, pts = [], animId

    const resize = () => {
      W = cvs.width  = window.innerWidth
      H = cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Moins de particules sur mobile
    const COUNT = isMobile() ? 40 : 140

    class Pt {
      reset() {
        this.x  = Math.random() * W
        this.y  = Math.random() * H
        this.r  = Math.random() * 1.2 + .2
        this.vx = (Math.random() - .5) * .25
        this.vy = (Math.random() - .5) * .25
        this.a  = Math.random() * .4 + .05
        this.c  = Math.random() > .55 ? '#2BFF9A' : '#00CFFF'
      }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle  = this.c
        ctx.globalAlpha = this.a
        ctx.fill()
      }
    }

    for (let i = 0; i < COUNT; i++) { const p = new Pt(); p.reset(); pts.push(p) }

    // Connexions uniquement sur desktop
    const CONNECT_DIST = isMobile() ? 0 : 90

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalAlpha = 1
      for (let i = 0; i < pts.length; i++) {
        if (CONNECT_DIST > 0) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x
            const dy = pts[i].y - pts[j].y
            const d  = Math.sqrt(dx * dx + dy * dy)
            if (d < CONNECT_DIST) {
              ctx.beginPath()
              ctx.moveTo(pts[i].x, pts[i].y)
              ctx.lineTo(pts[j].x, pts[j].y)
              ctx.strokeStyle = `rgba(0,207,255,${.06 * (1 - d / CONNECT_DIST)})`
              ctx.lineWidth   = .5
              ctx.globalAlpha = 1
              ctx.stroke()
            }
          }
        }
        pts[i].update()
        pts[i].draw()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  // Aurora parallax — desktop uniquement
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch) return

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth  - .5
      const y = e.clientY / window.innerHeight - .5
      document.querySelectorAll('.blob').forEach((b, i) => {
        const s = (i + 1) * 12
        b.style.transform = `translate(${x * s}px,${y * s}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div id="aurora">
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
