import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grow from '@mui/material/Grow'

async function generateLoadingTexts(loadingTextsTemplate, logData) {
  const body = {
    messages: [{ role: 'user', content: loadingTextsTemplate }],
    model: 'gpt-4',
  }

  try {
    const response = await fetch('/api/openai/completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    console.log('Loading texts:', data)

    if (data.chatCompletion?.choices?.[0]?.message?.content) {
      const generatedTexts = data.chatCompletion.choices[0].message.content
        .split('\n')
        .filter((text) => text && !/^\d+\.\s/.test(text))
        .map((text) => text.replace(/^"|"$/g, '').trim())
      logData({
        id: data.chatCompletion.id,
        data: generatedTexts,
        message: 'Generated loading text',
      })
      return generatedTexts
    }
  } catch (error) {
    console.error('Error generating loading texts:', error)
  }
  return []
}

export default function LoadingState({
  loadingTextsTemplate,
  logData,
  src,
  initialText,
}) {
  const [index, setIndex] = useState(0)
  const [texts, setTexts] = useState([initialText])
  const [hasGeneratedTexts, setHasGeneratedTexts] = useState(false)

  useEffect(() => {
    const fetchTexts = async () => {
      if (loadingTextsTemplate && !hasGeneratedTexts) {
        setHasGeneratedTexts(true)
        const generatedTexts = await generateLoadingTexts(
          loadingTextsTemplate,
          logData
        )
        if (generatedTexts.length > 0) {
          setTexts(generatedTexts)
        }
      }
    }
    fetchTexts()
  }, [loadingTextsTemplate, logData, hasGeneratedTexts])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [texts.length])

  return (
    <Stack
      spacing={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Avatar src={src} alt={'gif'} sx={{ width: 100, height: 100 }} />
      <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          {texts[index]}
        </Typography>
      </Grow>
    </Stack>
  )
}
