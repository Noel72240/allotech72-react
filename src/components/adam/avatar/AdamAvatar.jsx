import { useEffect, useState, useCallback, useRef } from 'react'
import {
  getAvatarAssetPaths,
  getAvatarSrc,
  ADAM_AVATAR_SIZES,
  ADAM_AVATAR_STATES,
} from '../../../config/adamAvatar.js'

const BLINK_MS = 150
const BLINKABLE = new Set([
  ADAM_AVATAR_STATES.NEUTRAL,
  ADAM_AVATAR_STATES.SMILE,
])

function preloadAvatarAssets() {
  Object.values(ADAM_AVATAR_STATES).forEach((state) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = getAvatarSrc(state)
  })
}

let assetsPreloaded = false

/**
 * Avatar Adam — halo / yeux / clignement via transform+opacity (taille fixe).
 */
export default function AdamAvatar({
  expression = ADAM_AVATAR_STATES.NEUTRAL,
  size = 'sm',
  showHalo = true,
  glowingEyes = false,
  enableBlink = false,
  alive = false,
  motion = 'idle',
  className = '',
  alt = 'Adam, assistant technique Allotech72',
}) {
  const px = ADAM_AVATAR_SIZES[size] ?? ADAM_AVATAR_SIZES.sm
  const [useSvgFallback, setUseSvgFallback] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const blinkTimeoutRef = useRef(null)
  const blinkRestoreRef = useRef(null)

  const mainSrc = useSvgFallback
    ? getAvatarAssetPaths(expression).svg
    : getAvatarSrc(expression)
  const blinkSrc = useSvgFallback
    ? getAvatarAssetPaths(ADAM_AVATAR_STATES.BLINK).svg
    : getAvatarSrc(ADAM_AVATAR_STATES.BLINK)

  useEffect(() => {
    if (assetsPreloaded) return undefined
    preloadAvatarAssets()
    assetsPreloaded = true
    return undefined
  }, [])

  const handleError = useCallback(() => {
    if (!useSvgFallback) setUseSvgFallback(true)
  }, [useSvgFallback])

  useEffect(() => {
    if (blinkTimeoutRef.current) window.clearTimeout(blinkTimeoutRef.current)
    if (blinkRestoreRef.current) window.clearTimeout(blinkRestoreRef.current)
    setBlinking(false)

    if (!enableBlink || !alive || !BLINKABLE.has(expression)) return undefined
    if (typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 4000
      blinkTimeoutRef.current = window.setTimeout(() => {
        setBlinking(true)
        blinkRestoreRef.current = window.setTimeout(() => {
          setBlinking(false)
          scheduleBlink()
        }, BLINK_MS)
      }, delay)
    }

    scheduleBlink()
    return () => {
      if (blinkTimeoutRef.current) window.clearTimeout(blinkTimeoutRef.current)
      if (blinkRestoreRef.current) window.clearTimeout(blinkRestoreRef.current)
    }
  }, [enableBlink, alive, expression])

  const motionClass = alive
    ? motion === 'thinking'
      ? 'adam-avatar__motion--thinking'
      : 'adam-avatar__motion--alive'
    : ''

  return (
    <div
      className={[
        'adam-avatar',
        `adam-avatar--${size}`,
        showHalo && 'adam-avatar--halo',
        glowingEyes && 'adam-avatar--glow-eyes',
        alive && 'adam-avatar--alive',
        className,
      ].filter(Boolean).join(' ')}
      style={{ '--adam-avatar-size': `${px}px` }}
    >
      {(alive || glowingEyes) && (
        <span className="adam-avatar__eye-glow" aria-hidden="true" />
      )}

      <div className="adam-avatar__frame">
        <div className={`adam-avatar__motion ${motionClass}`.trim()}>
          <img
            className="adam-avatar__img"
            src={mainSrc}
            alt={alt}
            width={px}
            height={px}
            loading="eager"
            decoding="async"
            draggable={false}
            onError={handleError}
          />
          {enableBlink && (
            <img
              className={`adam-avatar__blink ${blinking ? 'adam-avatar__blink--on' : ''}`}
              src={blinkSrc}
              alt=""
              aria-hidden="true"
              width={px}
              height={px}
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
