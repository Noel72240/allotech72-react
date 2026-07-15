import { useEffect, useState, useCallback, useRef } from 'react'
import {
  getAvatarAssetPaths,
  getAvatarSrc,
  getAvatarVideoSrc,
  ADAM_AVATAR_SIZES,
  ADAM_AVATAR_STATES,
} from '../../../config/adamAvatar.js'

const BLINK_MS = 160
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
 * Avatar Adam — rendu cinématique (CSS) + option vidéo WebM si disponible.
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
  const [videoFailed, setVideoFailed] = useState(false)
  const blinkTimeoutRef = useRef(null)
  const blinkRestoreRef = useRef(null)

  const reduceMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // FAB/header + réfléchit + coucou + dernière bulle de réponse.
  const videoAllowed = size === 'xl' || size === 'lg' || size === 'md' || size === 'sm'
    || (size === 'msg' && (
      motion === 'thinking'
      || motion === 'replying'
      || expression === ADAM_AVATAR_STATES.WAVE
    ))
  const videoSrc = !videoFailed && !reduceMotion && videoAllowed
    ? getAvatarVideoSrc(expression, motion)
    : null
  const useVideo = Boolean(alive && videoSrc)
  const posterSrc = useSvgFallback
    ? getAvatarAssetPaths(expression).svg
    : getAvatarSrc(expression)

  const mainSrc = useSvgFallback
    ? getAvatarAssetPaths(expression).svg
    : getAvatarSrc(expression)
  const blinkSrc = useSvgFallback
    ? getAvatarAssetPaths(ADAM_AVATAR_STATES.BLINK).svg
    : getAvatarSrc(ADAM_AVATAR_STATES.BLINK)
  const blendSrc = useSvgFallback
    ? getAvatarAssetPaths(ADAM_AVATAR_STATES.SMILE).svg
    : getAvatarSrc(ADAM_AVATAR_STATES.SMILE)
  const showBlend = alive
    && !useVideo
    && expression === ADAM_AVATAR_STATES.NEUTRAL
    && (size === 'xl' || size === 'lg' || size === 'md')

  useEffect(() => {
    if (assetsPreloaded) return undefined
    preloadAvatarAssets()
    assetsPreloaded = true
    return undefined
  }, [])

  useEffect(() => {
    setVideoFailed(false)
  }, [expression, motion])

  const handleError = useCallback(() => {
    if (!useSvgFallback) setUseSvgFallback(true)
  }, [useSvgFallback])

  useEffect(() => {
    if (blinkTimeoutRef.current) window.clearTimeout(blinkTimeoutRef.current)
    if (blinkRestoreRef.current) window.clearTimeout(blinkRestoreRef.current)
    setBlinking(false)

    if (useVideo || !enableBlink || !alive || !BLINKABLE.has(expression)) {
      return undefined
    }
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
  }, [enableBlink, alive, expression, useVideo])

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
        alive && !useVideo && 'adam-avatar--cinema',
        useVideo && 'adam-avatar--video',
        expression === ADAM_AVATAR_STATES.WAVE && 'adam-avatar--wave',
        className,
      ].filter(Boolean).join(' ')}
      style={{ '--adam-avatar-size': `${px}px` }}
    >
      {(alive || glowingEyes) && !useVideo && (
        <span className="adam-avatar__eye-glow" aria-hidden="true" />
      )}

      <div className="adam-avatar__frame">
        <div className={`adam-avatar__motion ${motionClass}`.trim()}>
          {useVideo ? (
            <video
              key={videoSrc}
              className="adam-avatar__video"
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-label={alt}
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <>
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
              {showBlend && (
                <img
                  className="adam-avatar__blend"
                  src={blendSrc}
                  alt=""
                  aria-hidden="true"
                  width={px}
                  height={px}
                  draggable={false}
                />
              )}
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
              {alive && <span className="adam-avatar__sheen" aria-hidden="true" />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
