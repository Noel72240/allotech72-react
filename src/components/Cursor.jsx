import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cur  = document.getElementById('cursor')
    const ring = document.getElementById('cring')
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      cur.style.left = mx + 'px'; cur.style.top = my + 'px'
    }
    window.addEventListener('mousemove', onMove)

    let animId
    const animate = () => {
      rx += (mx - rx) * .12; ry += (my - ry) * .12
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
      animId = requestAnimationFrame(animate)
    }
    animate()

    const addHover = () => document.body.classList.add('chov')
    const rmHover  = () => document.body.classList.remove('chov')
    const sel = 'a,button,.svc-card,.chip,.avis-card,.av-item,.sb'
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', rmHover)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return null
}
