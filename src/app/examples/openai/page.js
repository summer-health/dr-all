'use client'
import React from 'react'

export default function OpenAI() {
  const [audioSrc, setAudioSrc] = React.useState(null)
  const [text, setText] = React.useState('')
  const [response, setResponse] = React.useState('')

  async function playTTS(message) {
    const res = await fetch('/api/openai/tts', {
      method: 'POST',
      body: JSON.stringify({
        message,
      }),
    })
    const arrayBuffer = await res.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'audio/mp3' })

    const url = URL.createObjectURL(blob)
    setAudioSrc(url)
  }

  React.useEffect(() => {
    if (response) {
      playTTS(response)
    }
  }, [response])

  return (
    <div>
      <textarea onChange={(e) => setText(e.target.value)}>{text}</textarea>
      <button
        onClick={async () => {
          const res = await fetch('/api/openai/completion', {
            method: 'POST',
            body: JSON.stringify({
              messages: [{ role: 'user', content: text }],
            }),
          })
          const json = await res.json()
          setResponse(json.chatCompletion.choices[0].message.content)
          console.log(json)
        }}
      >
        test
      </button>

      {audioSrc && <audio controls src={audioSrc} autoPlay />}
    </div>
  )
}
