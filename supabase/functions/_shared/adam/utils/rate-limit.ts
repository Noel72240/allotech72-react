import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LIMIT = Number(Deno.env.get('ADAM_RATE_LIMIT_PER_HOUR') || '30')

export async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  key: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const hash = await hashKey(key)
  const windowStart = new Date()
  windowStart.setMinutes(0, 0, 0)

  const { data } = await supabase
    .from('adam_rate_limits')
    .select('id, count')
    .eq('key_hash', hash)
    .eq('window_start', windowStart.toISOString())
    .maybeSingle()

  if (!data) {
    await supabase.from('adam_rate_limits').insert({
      key_hash: hash,
      window_start: windowStart.toISOString(),
      count: 1,
    })
    return { allowed: true, remaining: LIMIT - 1 }
  }

  if (data.count >= LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  await supabase
    .from('adam_rate_limits')
    .update({ count: data.count + 1 })
    .eq('id', data.id)

  return { allowed: true, remaining: LIMIT - data.count - 1 }
}

async function hashKey(key: string): Promise<string> {
  const data = new TextEncoder().encode(key)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('')
}
