import { dalle } from '../../libs/api/openai'

export default async function handler(req, res) {
  const { prompt, size } = req.body
  try {
    const response = await dalle.text2im({ prompt, size })
    const url = response.data[0].url
    res.status(200).json({ url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
