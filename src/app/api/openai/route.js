import openai from "@/libs/api/openai";

// curl "http://localhost:3000/api/openai"

export async function GET() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });

  return Response.json({ data: chatCompletion });
}
