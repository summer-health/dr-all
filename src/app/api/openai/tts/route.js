import openai from '@/libs/api/openai'

export async function POST(req) {
  // return Response.json({ test: 'test' })

  const body = await req.json()
  const audioStream = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    response_format: 'mp3',
    input: body.message,
  })

  return new Response(audioStream.body)
}
