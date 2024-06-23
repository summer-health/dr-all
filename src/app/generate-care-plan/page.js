'use client'

import { useEffect, useState, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grow from '@mui/material/Grow'
import Avatar from '@mui/material/Avatar'
import FaceIcon from '@mui/icons-material/Face'
import { useDebug } from '@/components/context/debug-context'
import { useDoctor } from '@/components/context/doctor-context'
import { useCarePlan } from '@/components/context/care-plan-context'
import { useRouter } from 'next/navigation'
import { useFamily } from '@/components/context/family-context'

const defaultPersona = `Dr. Emma Lee is a friendly and empathetic female pediatrician of Asian ethnicity. She greets her patients warmly by their first names, creating a welcoming and personal atmosphere. With a casual tone, she makes her patients feel at ease while ensuring clear and detailed communication, using layman's terms with occasional medical jargon for accuracy. Dr. Lee is known for her light-hearted humor, often incorporating puns and light jokes to make the experience enjoyable. She always acknowledges and validates her patients' feelings and provides words of encouragement, especially during challenging times. Her explanations are thorough yet not overwhelming, and she consistently asks follow-up questions to confirm understanding, ensuring her patients and their families feel well-informed and cared for.`

const defaultFamily = `Rachel: Mom
Robin: Child, born April 1, 2024

# Child's Medical Information:
* Allergy:Tuna
* Current Medications: None
* Developmental Milestones: Slight delays in some milestones
* Immunization Status: Mostly up-to-date, with a few pending
* Childcare: Nanny or babysitter
* Dietary Concerns: Specific concerns about diet
* Behavioral and Emotional Health: No observed signs of anxiety, depression, or other mental health issues
`

export default function GenerateCarePlan() {
  const { logData } = useDebug()
  const { persona } = useDoctor()
  const { family } = useFamily()
  const { questions, setCarePlan } = useCarePlan()
  const [finalPrompt, setFinalPrompt] = useState(null)
  const [systemPrompt, setSystemPrompt] = useState(null)
  const [loadingTextsTemplate, setLoadingTextsTemplate] = useState(null)
  const [loadingTexts, setLoadingTexts] = useState([
    'Generating your perfect care plan...',
  ])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const hasGeneratedCarePlan = useRef(false)
  const hasGeneratedLoadingTexts = useRef(false)

  useEffect(() => {
    const fetchPromptTemplate = async () => {
      try {
        const [loadedSystemPrompt, generateFinalPrompt, loadingTextsPrompt] =
          await Promise.all([
            fetch('/care-plan-system.txt').then((res) => res.text()),
            fetch('/care-plan-final-prompt.txt').then((res) => res.text()),
            fetch('/generate-loading-texts-prompt.txt').then((res) =>
              res.text()
            ),
          ])
        setSystemPrompt(loadedSystemPrompt)
        setFinalPrompt(generateFinalPrompt)
        setLoadingTextsTemplate(loadingTextsPrompt)
      } catch (error) {
        console.error('Error fetching the text files:', error)
      }
    }

    fetchPromptTemplate()
  }, [])

  useEffect(() => {
    if (hasGeneratedLoadingTexts.current || !loadingTextsTemplate) {
      return
    }
    hasGeneratedLoadingTexts.current = true

    const generateLoadingTexts = async () => {
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
    if (hasGeneratedCarePlan.current || !systemPrompt || !finalPrompt) {
      return
    }
    hasGeneratedCarePlan.current = true

    const generateCarePlan = async () => {
      let finalSystemPrompt = systemPrompt
      if (persona) {
        const text = Object.entries(persona).reduce((acc, [key, value]) => {
          if (key === 'doctorAvatar') return acc
          return `${acc}\n- ${key}: ${value}`
        }, '')
        console.log('doctor', text)
        finalSystemPrompt = finalSystemPrompt.replace('{doctorPersona}', text)
      } else {
        finalSystemPrompt = finalSystemPrompt.replace(
          '{doctorPersona}',
          defaultPersona
        )
      }
      if (family) {
        const text = Object.entries(family).reduce((acc, [key, value]) => {
          return `${acc}\n- ${key}: ${value}`
        }, '')
        console.log('family', text)
        finalSystemPrompt = finalSystemPrompt.replace('{family}', text)
      } else {
        finalSystemPrompt = finalSystemPrompt.replace('{family}', defaultFamily)
      }

      const messages = [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: finalPrompt },
      ]
      const body = { messages, model: 'gpt-4o' }

      try {
        const response = await fetch('/api/openai/completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await response.json()
        console.log('care plan', data)

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
          setCarePlan(content)

          logData({
            id: data.chatCompletion.id,
            data: content,
            message: 'Generated carePlan',
          })

          // Set loading to false after everything is ready
          setIsLoading(false)
          router.push('/care-plan')
        }
      } catch (error) {
        console.error('Error generating doctor description:', error)
      }
    }

    generateCarePlan()
  }, [finalPrompt, questions, logData, setCarePlan])

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="start"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%', paddingTop: 10 }}
    >
      {isLoading ? (
        <LoadingState texts={loadingTexts} />
      ) : (
        <Stack spacing={2} alignItems="center">
          {persona && persona.Name && persona.doctorAvatar ? (
            <Avatar
              src={persona.doctorAvatar}
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
