'use client'

import { useEffect, useState, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import FaceIcon from '@mui/icons-material/Face'
import { useDebug } from '@/components/context/debug-context'
import { useDoctor } from '@/components/context/doctor-context'
import LoadingState from '@/components/loading-page'
import { store } from '@/libs/localStorage'
import { useRouter } from 'next/navigation'

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to convert Blob to Base64'))
    reader.readAsDataURL(blob)
  })
}

export default function GenerateDoctor() {
  const router = useRouter()
  const { logData } = useDebug()
  const { questions, persona, setPersona, setAvatar } = useDoctor()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [promptTemplate, setPromptTemplate] = useState(null)
  const [loadingTextsTemplate, setLoadingTextsTemplate] = useState(null)
  const [avatarPromptTemplate, setAvatarPromptTemplate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasGeneratedPersona = useRef(false)

  useEffect(() => {
    const fetchPromptTemplates = async () => {
      try {
        const [generateDoctorPrompt, loadingTextsPrompt, avatarPrompt] =
          await Promise.all([
            fetch('/generate-doctor-prompt.txt').then((res) => res.text()),
            fetch('/generate-loading-texts-prompt.txt').then((res) =>
              res.text()
            ),
            fetch('/generate-avatar-prompt.txt').then((res) => res.text()),
          ])
        setPromptTemplate(generateDoctorPrompt)
        setLoadingTextsTemplate(loadingTextsPrompt)
        setAvatarPromptTemplate(avatarPrompt)
      } catch (error) {
        console.error('Error fetching the text files:', error)
      }
    }

    fetchPromptTemplates()
  }, [])

  useEffect(() => {
    if (hasGeneratedPersona.current || !promptTemplate || !avatarPromptTemplate)
      return
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

      const body = {
        messages: [descriptionPrompt],
        model: 'gpt-4',
      }

      try {
        const response = await fetch('/api/openai/completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await response.json()
        console.log('Initial persona:', data)

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

          // Set the persona without the avatar URL first
          setPersona(content.Persona)

          // Generate avatar using DALL-E
          const avatarPrompt = avatarPromptTemplate
            .replace('GENDER_PLACEHOLDER', content.Persona.Gender)
            .replace('ETHNICITY_PLACEHOLDER', content.Persona.Ethnicity)

          const avatarResponse = await fetch(
            `/api/openai/image?prompt=${encodeURIComponent(avatarPrompt)}`
          )
          const avatarBlob = await avatarResponse.blob()
          blobToBase64(avatarBlob)
            .then((base64String) => {
              setAvatar(base64String)
            })
            .catch((error) => {
              console.error('Error converting Blob to Base64:', error)
            })
          const avatarUrl = URL.createObjectURL(avatarBlob)

          // content.Persona['Image Url'] = avatarUrl
          setAvatarUrl(avatarUrl)

          // Update persona with avatar URL
          const fullPersona = {
            ...content.Persona,
            imageUrl: avatarUrl,
          }
          setPersona(fullPersona)

          logData({
            id: data.chatCompletion.id,
            data: fullPersona,
            message: 'Generated doctor persona with avatar',
          })

          // Set loading to false after everything is ready
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error generating doctor description:', error)
      }
    }

    generatePersona()
  }, [promptTemplate, avatarPromptTemplate, questions, logData, setPersona])

  console.log('persona', persona)
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="start"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%', paddingTop: 10 }}
    >
      {isLoading ? (
        <LoadingState
          loadingTextsTemplate={loadingTextsTemplate}
          logData={logData}
          src="/doctor-generator.gif"
          initialText="Generating your perfect doctor..."
        />
      ) : (
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
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            {persona.Introduction}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/build-family')}
          >
            Build Family
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
