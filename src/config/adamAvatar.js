/**
 * Assets avatar Adam — remplacer les PNG dans public/adam/avatar/
 * Les SVG servent de fallback jusqu'aux exports définitifs.
 */

export const ADAM_AVATAR_STATES = {
  NEUTRAL: 'neutral',
  THINKING: 'thinking',
  SMILE: 'smile',
  POSITIVE: 'positive',
  BLINK: 'blink',
  WAVE: 'wave',
}

const BASE = '/adam/avatar'

/** PNG définitifs dans public/adam/avatar/ */
export const ADAM_AVATAR_PREFER_PNG = true

/**
 * Boucles vidéo (Kling MP4).
 * idle = FAB/header · thinking = réfléchit · replying = bulles de réponse
 * (replying utilise idle tant qu’adam-reply.mp4 n’est pas fourni)
 */
export const ADAM_AVATAR_USE_VIDEO = true

export const ADAM_AVATAR_VIDEOS = {
  idle: `${BASE}/adam-idle.mp4`,
  thinking: `${BASE}/adam-thinking-loop.mp4`,
  replying: `${BASE}/adam-reply.mp4`,
}

/** @param {keyof typeof ADAM_AVATAR_STATES | string} state */
export function getAvatarAssetPaths(state) {
  const key = String(state).toLowerCase()
  return {
    png: `${BASE}/adam-${key}.png`,
    svg: `${BASE}/adam-${key}.svg`,
  }
}

/** @param {keyof typeof ADAM_AVATAR_STATES | string} state */
export function getAvatarSrc(state, preferPng = ADAM_AVATAR_PREFER_PNG) {
  const paths = getAvatarAssetPaths(state)
  return preferPng ? paths.png : paths.svg
}

/**
 * @param {string} expression
 * @param {'idle' | 'thinking' | 'replying'} [motion]
 * @returns {string | null}
 */
export function getAvatarVideoSrc(expression, motion = 'idle') {
  if (!ADAM_AVATAR_USE_VIDEO) return null
  // Pose « coucou » : PNG dédié (pas de boucle vidéo pour l’instant)
  if (expression === ADAM_AVATAR_STATES.WAVE) return null
  if (motion === 'thinking' || expression === ADAM_AVATAR_STATES.THINKING) {
    return ADAM_AVATAR_VIDEOS.thinking
  }
  if (motion === 'replying') {
    return ADAM_AVATAR_VIDEOS.replying
  }
  return ADAM_AVATAR_VIDEOS.idle
}

export const ADAM_AVATAR_SIZES = {
  msg: 50,
  xs: 52,
  sm: 56,
  md: 64,
  lg: 80,
  xl: 108,
}
