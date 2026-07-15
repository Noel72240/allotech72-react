import { useEffect, useState, useCallback } from 'react'
import {
  getAvatarAssetPaths,
  getAvatarSrc,
  ADAM_AVATAR_SIZES,
  ADAM_AVATAR_STATES,
} from '../../../config/adamAvatar.js'

function preloadAvatarAssets() {
  Object.values(ADAM_AVATAR_STATES).forEach((state) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = getAvatarSrc(state)
  })
}

let assetsPreloaded = false

/**
 * Avatar Adam — conteneur taille fixe ; respiration / tête animées à l'intérieur.
 */
export default function AdamAvatar({
  expression = ADAM_AVATAR_STATES.NEUTRAL,
  size = 'sm',
  showHalo = true,
  glowingEyes = false,
  alive = false,
  motion = 'idle',
  className = '',
  alt = 'Adam, assistant technique Allotech72',
}) {
  const px = ADAM_AVATAR_SIZES[size] ?? ADAM_AVATAR_SIZES.sm
  const [useSvgFallback, setUseSvgFallback] = useState(false)

  const mainSrc = useSvgFallback
    ? getAvatarAssetPaths(expression).svg
    : getAvatarSrc(expression)

  useEffect(() => {
    if (assetsPreloaded) return undefined
    preloadAvatarAssets()
    assetsPreloaded = true
    return undefined
  }, [])

  const handleError = useCallback(() => {
    if (!useSvgFallback) setUseSvgFallback(true)
  }, [useSvgFallback])

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
      {alive && (
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
        </div>
      </div>
    </div>
  )
}
