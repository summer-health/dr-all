import openai from '@/libs/api/openai'

// curl "http://localhost:3000/api/openai/tts" -X POST -H "Content-Type: application/json" -d '{"message":"Hello,"} --output hello.mp3

export async function POST(req) {
  const body = await req.json()
  const audioStream = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    response_format: 'mp3',
    input: body.message,
  })

  return new Response(audioStream.body)
}
