import openai from '@/libs/api/openai'
import { NextRequest } from 'next/server'

// curl "http://localhost:3000/api/openai/image?prompt=create summer health logo" --output output.png

/**
 *
 * @param {NextRequest} req
 * @returns
 */
export async function GET(req) {
  const prompt = req.nextUrl.searchParams.get('prompt')
  if (!prompt) {
    return new Response('prompt is required', { status: 400 })
  }

  const response = await openai.images.generate({
    model: 'dall-e-3',
    n: 1,
    quality: 'standard',
    response_format: 'b64_json',
    size: '1024x1024',
    prompt,
  })
  const b64 = response.data[0].b64_json
  const image = Buffer.from(b64, 'base64')
  return new Response(image, { headers: { 'Content-Type': 'image/png' } })
}
