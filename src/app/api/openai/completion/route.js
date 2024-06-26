import openai from '@/libs/api/openai'

// curl "http://localhost:3000/api/openai/completion" -X POST -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Say this is a test"}]}

/**
 *
 * @param {NextRequest} req
 * @returns
 */
export async function POST(req) {
  const body = await req.json()
  const chatCompletion = await openai.chat.completions.create({
    messages: body.messages,
    response_format: body.response_format,
    model: body.model || 'gpt-3.5-turbo',
  })
  return Response.json({ chatCompletion })
}
