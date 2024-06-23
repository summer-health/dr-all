'use client'

import { useDoctor } from '../../components/context/doctor-context'
import { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material'

export default function GenerateDr() {
  const { questions, setPersona } = useDoctor()
  const [personaDescription, setPersonaDescription] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    if (questions.length > 0) {
      console.log('Questions collected for persona generation:', questions)
      fetchPrompt()
    } else {
      console.log('No questions found for persona generation.')
    }
  }, [questions])

  const fetchPrompt = async () => {
    try {
      const response = await fetch('/generate-dr-prompt.txt')
      const data = await response.text()
      setPrompt(data)
      generatePersona(data)
    } catch (error) {
      console.error('Error fetching the prompt file:', error)
    }
  }

  const generatePersona = (loadedPrompt) => {
    const responses = questions
      .map(
        (q) =>
          `Category: ${q.category}\nQuestion: ${q.question}\nAnswer: ${q.answer}`
      )
      .join('\n\n')
    const personaPrompt = loadedPrompt.replace('{{responses}}', responses)
    console.log('Persona Prompt:', personaPrompt)
    const messages = [
      { role: 'system', content: 'Create a detailed doctor persona' },
      { role: 'user', content: personaPrompt },
    ]
    const body = { messages, model: 'gpt-4' }
    fetch('/api/openai/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.chatCompletion?.choices?.[0]?.message?.content) {
          const persona = data.chatCompletion.choices[0].message.content
          console.log('Generated Persona:', persona)
          setPersonaDescription(persona)
          setPersona(persona)
          generateAvatar(persona)
        } else {
          console.error('No content in chat completion response')
        }
      })
      .catch((error) => {
        console.error('Error generating persona:', error)
      })
  }

  const generateAvatar = (persona) => {
    const prompt = `Generate an image of a cartoon doctor that best reflects the following persona: ${persona}`
    console.log('Avatar Prompt:', prompt)
    const body = { prompt, size: '1024x1024' }
    fetch('/api/openai/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Image generation response:', data)
        if (data.url) {
          console.log('Generated Avatar URL:', data.url)
          setAvatarUrl(data.url)
        } else {
          console.error('No URL in image generation response')
        }
      })
      .catch((error) => {
        console.error('Error generating avatar:', error)
      })
  }

  console.log('Persona Description:', personaDescription)
  console.log('Avatar URL:', avatarUrl)

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Generated Doctor Persona
      </Typography>
      {personaDescription ? (
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {personaDescription}
            </Typography>
            {avatarUrl && (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
              >
                <Avatar
                  alt="Doctor Avatar"
                  src={avatarUrl}
                  sx={{ width: 200, height: 200 }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1">No persona generated yet.</Typography>
      )}
    </Box>
  )
}
