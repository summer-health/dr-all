'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import React from 'react'
import Box from '@mui/material/Box'

export default function OpenAI() {
  const [audioSrc, setAudioSrc] = React.useState(null)
  const [text, setText] = React.useState('')
  const [response, setResponse] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  async function playTTS(message) {
    const res = await fetch(`/api/openai/tts?message=${message}`)
    const arrayBuffer = await res.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'audio/mp3' })

    const url = URL.createObjectURL(blob)
    setAudioSrc(url)
    setIsLoading(false)
  }

  React.useEffect(() => {
    if (response) {
      return playTTS(response).finally(() => setIsLoading(false))
    }
  }, [response])

  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Ask question"
          multiline
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <LoadingButton
          variant="contained"
          loading={isLoading}
          onClick={async () => {
            try {
              setIsLoading(true)
              const res = await fetch('/api/openai/completion', {
                method: 'POST',
                body: JSON.stringify({
                  messages: [{ role: 'user', content: text }],
                }),
              })
              const json = await res.json()
              setResponse(json.chatCompletion.choices[0].message.content)
              console.log(response)
            } catch {
              setIsLoading(false)
            }
          }}
        >
          test
        </LoadingButton>

        {audioSrc && <audio controls src={audioSrc} autoPlay />}
      </Box>
    </>
  )
}
