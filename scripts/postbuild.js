/**
 * Post-build : meta HTML par route (Facebook/Google) + optimisation og-image
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRERENDER_ROUTES, SITE_URL, OG_IMAGE } from './prerender-routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dist = path.join(root, 'dist')

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}=["']${key}["']\\s+content=)["'][^"']*["']`, 'i')
  if (re.test(html)) return html.replace(re, `$1"${value}"`)
  return html
}

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
}

function setCanonical(html, url) {
  return html.replace(
    /<link rel="canonical" href="[^"]*"/i,
    `<link rel="canonical" href="${url}"`,
  )
}

function applyRouteMeta(html, route) {
  const url = SITE_URL + route.path
  let out = setTitle(html, route.title)
  out = setMeta(out, 'name', 'description', route.description)
  out = setCanonical(out, url)
  out = setMeta(out, 'property', 'og:title', route.ogTitle || route.title)
  out = setMeta(out, 'property', 'og:description', route.description)
  out = setMeta(out, 'property', 'og:url', url)
  out = setMeta(out, 'name', 'twitter:title', route.ogTitle || route.title)
  out = setMeta(out, 'name', 'twitter:description', route.description)
  out = setMeta(out, 'property', 'og:image', OG_IMAGE)
  out = setMeta(out, 'name', 'twitter:image', OG_IMAGE)
  return out
}

async function optimizeOgImage() {
  try {
    const sharp = (await import('sharp')).default
    const src = path.join(dist, 'og-image.png')
    if (!fs.existsSync(src)) return
    const buf = await sharp(src)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()
    fs.writeFileSync(path.join(dist, 'og-image.jpg'), buf)
    const pngBuf = await sharp(buf).png({ compressionLevel: 9 }).toBuffer()
    fs.writeFileSync(src, pngBuf)
    console.log(`og-image optimisé (${Math.round(pngBuf.length / 1024)} Ko PNG)`)
  } catch (e) {
    console.warn('Optimisation og-image ignorée:', e.message)
  }
}

function prerenderMeta() {
  const indexPath = path.join(dist, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html introuvable — lancez vite build d’abord')
    process.exit(1)
  }
  const baseHtml = fs.readFileSync(indexPath, 'utf8')

  for (const route of PRERENDER_ROUTES) {
    const html = applyRouteMeta(baseHtml, route)
    const dir = path.join(dist, route.path.slice(1))
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html)
    console.log(`Prerender meta: ${route.path}`)
  }
}

await optimizeOgImage()
prerenderMeta()
