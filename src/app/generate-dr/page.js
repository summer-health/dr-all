'use client'

import { useEffect, useState, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useDebug } from '@/components/context/debug-context'
import { useDoctor } from '@/components/context/doctor-context'

export default function GenerateDoctor() {
  const { logData } = useDebug()
  const { questions, setPersona } = useDoctor()
  const [persona, setLocalPersona] = useState(null)
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
        }
      } catch (error) {
        console.error('Error generating doctor description:', error)
      }
    }

    generatePersona()
  }, [promptTemplate, questions, logData, setPersona])

  return (
    <Box sx={{ padding: 2 }}>
      {persona ? (
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            {persona.Name}
          </Typography>
          <Typography variant="body1">{persona.Description}</Typography>
        </Stack>
      ) : (
        <Typography variant="body1">
          Generating your ideal pediatrician...
        </Typography>
      )}
    </Box>
  )
}
