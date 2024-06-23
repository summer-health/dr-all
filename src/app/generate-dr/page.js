'use client'

import { useEffect, useState, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grow from '@mui/material/Grow'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import FaceIcon from '@mui/icons-material/Face'
import { useDebug } from '@/components/context/debug-context'
import { useDoctor } from '@/components/context/doctor-context'

export default function GenerateDoctor() {
  const { logData } = useDebug()
  const { questions, setPersona } = useDoctor()
  const [persona, setLocalPersona] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [promptTemplate, setPromptTemplate] = useState(null)
  const hasGeneratedPersona = useRef(false)

  useEffect(() => {
    const fetchPromptTemplate = async () => {
      try {
        const response = await fetch('/generate-doctor-prompt.txt')
        const data = await response.text()
        setPromptTemplate(data)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    fetchPromptTemplate()
  }, [])

  useEffect(() => {
    if (hasGeneratedPersona.current || !promptTemplate) {
      return
    }
    hasGeneratedPersona.current = true

    const generatePersona = async () => {
      const filledPrompt = promptTemplate.replace(
        'QUESTIONS_PLACEHOLDER',
        questions.map((q) => `${q.category}: ${q.answer}`).join(', ')
      )

      const descriptionPrompt = {
        role: 'user',
        content: filledPrompt,
      }

      const messages = [descriptionPrompt]
      const body = { messages, model: 'gpt-4' }

      try {
        const response = await fetch('/api/openai/completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        const data = await response.json()
        console.log('Final API Response data:', data)
        if (data.chatCompletion?.choices?.[0]?.message?.content) {
          let content
          try {
            content = JSON.parse(data.chatCompletion.choices[0].message.content)
          } catch (error) {
            console.error('Error parsing JSON:', error)
            content = {
              name: 'Error',
              description: data.chatCompletion.choices[0].message.content,
            }
          }

          logData({
            id: data.chatCompletion.id,
            data: content,
            message: 'Generated doctor description',
          })

          setPersona(content.Persona)
          setLocalPersona(content.Persona)

          // Generate avatar using DALL-E
          const avatarResponse = await fetch(
            `/api/openai/image?prompt=${encodeURIComponent(content.Persona.Appearance + ' digital animation style with a vibrant, child-friendly aesthetic')}`
          )
          const avatarBlob = await avatarResponse.blob()
          const avatarUrl = URL.createObjectURL(avatarBlob)
          setAvatarUrl(avatarUrl)

          console.log('avatarUrl:', avatarUrl)
          console.log('avatarResponse:', avatarResponse)
        }
      } catch (error) {
        console.error('Error generating doctor description:', error)
      }
    }

    generatePersona()
  }, [promptTemplate, questions, logData, setPersona])

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      {persona ? (
        <Stack spacing={2} alignItems="center">
          {avatarUrl ? (
            <Avatar
              src={avatarUrl}
              alt={persona.Name}
              sx={{ width: 100, height: 100 }}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }}>
              <FaceIcon style={{ fontSize: 60 }} />
            </Avatar>
          )}
          <Typography variant="h4" component="h1">
            {persona.Name}
          </Typography>
          <Typography variant="body1">{persona.Description}</Typography>
        </Stack>
      ) : (
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
          <CircularProgress />
          <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Generating your ideal pediatrician...
            </Typography>
          </Grow>
          <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={2000}>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please wait while we gather the best qualities...
            </Typography>
          </Grow>
          <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={3000}>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Almost there...
            </Typography>
          </Grow>
        </Stack>
      )}
    </Stack>
  )
}
