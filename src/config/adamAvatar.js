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
}

const BASE = '/adam/avatar'

/** PNG définitifs dans public/adam/avatar/ */
export const ADAM_AVATAR_PREFER_PNG = true

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

export const ADAM_AVATAR_SIZES = {
  xs: 64,
  sm: 80,
  md: 96,
  lg: 112,
  xl: 128,
}
