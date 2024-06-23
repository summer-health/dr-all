'use client'

import { useEffect, useState, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grow from '@mui/material/Grow'
import Avatar from '@mui/material/Avatar'
import FaceIcon from '@mui/icons-material/Face'
import { useDebug } from '@/components/context/debug-context'
import { useDoctor } from '@/components/context/doctor-context'
import { store } from '@/libs/localStorage'
import { useCarePlan } from '@/components/context/care-plan-context'

export default function GenerateCarePlan() {
  const { logData } = useDebug()
  const { questions, persona, setPersona } = useDoctor()
  const { carePlan } = useCarePlan()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [promptTemplate, setPromptTemplate] = useState(null)
  const [loadingTextsTemplate, setLoadingTextsTemplate] = useState(null)
  const [avatarPromptTemplate, setAvatarPromptTemplate] = useState(null)
  const [loadingTexts, setLoadingTexts] = useState([
    'Generating your perfect care plan...',
  ])
  const [isLoading, setIsLoading] = useState(true)
  const hasGeneratedPersona = useRef(false)
  const hasGeneratedLoadingTexts = useRef(false)

  useEffect(() => {
    const fetchPromptTemplate = async () => {
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

    fetchPromptTemplate()
  }, [])

  useEffect(() => {
    const generateLoadingTexts = async () => {
      if (hasGeneratedLoadingTexts.current || !loadingTextsTemplate) return
      hasGeneratedLoadingTexts.current = true

      const loadingPrompt = loadingTextsTemplate.replace(
        'QUESTIONS_PLACEHOLDER',
        questions.map((q) => `${q.category}: ${q.answer}`).join(', ')
      )

      const body = {
        messages: [{ role: 'user', content: loadingPrompt }],
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
          setLoadingTexts(generatedTexts)
          logData({
            id: data.chatCompletion.id,
            data: generatedTexts,
            message: 'Generated loading text',
          })
        }
      } catch (error) {
        console.error('Error generating loading texts:', error)
      }
    }

    generateLoadingTexts()
  }, [questions, loadingTextsTemplate, logData])

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
          store('doctorAvatar', avatarBlob)
          const avatarUrl = URL.createObjectURL(avatarBlob)

          content.Persona['Image Url'] = avatarUrl
          setAvatarUrl(avatarUrl)

          // Update persona with avatar URL
          const fullPersona = {
            ...content.Persona,
            'Image Url': avatarUrl,
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

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      {isLoading ? (
        <LoadingState texts={loadingTexts} />
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
            {persona['Doctor Introduction']}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}

function LoadingState({ texts }) {
  const [index, setIndex] = useState(0)

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
      <img
        src="/care-plan-generator.gif"
        alt="Loading..."
        style={{ width: 150, height: 150 }}
      />
      <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {texts[index]}
        </Typography>
      </Grow>
    </Stack>
  )
}
