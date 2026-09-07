const WHISPER_VERSION = 'vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'API token not configured' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch {}
  }

  const audio = body && body.audio
  if (!audio) {
    return res.status(400).json({ error: 'audio required' })
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: WHISPER_VERSION,
        input: {
          task: (body && body.task) || 'transcribe',
          audio,
          language: 'None',
          timestamp: 'chunk',
          batch_size: 64,
          diarise_audio: false
        }
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Replicate transcribe error:', err)
      return res.status(502).json({ error: 'Replicate request failed' })
    }

    let pred = await response.json()

    while (pred.status !== 'succeeded' && pred.status !== 'failed' && pred.status !== 'canceled') {
      await new Promise(r => setTimeout(r, 1000))
      const pr = await fetch(pred.urls.get, { headers: { 'Authorization': `Bearer ${token}` } })
      pred = await pr.json()
    }

    if (pred.status !== 'succeeded') {
      return res.status(502).json({ error: 'Transcription failed' })
    }

    const text = (pred.output && (pred.output.text || pred.output.transcription)) || ''
    return res.json({ text })
  } catch (err) {
    console.error('Transcribe error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
