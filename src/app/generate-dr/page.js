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
  const hasGeneratedPersona = useRef(false)

  useEffect(() => {
    if (hasGeneratedPersona.current) {
      return
    }
    hasGeneratedPersona.current = true

    const generatePersona = async () => {
      const descriptionPrompt = {
        role: 'user',
        content: `Based on the following responses, generate a brief persona description for the ideal pediatrician in JSON format. The JSON should have a Persona object that includes the following fields:

- Name: The name of the pediatrician (string)
- Job Title: Always "Pediatrician" (string)
- Description: A one-paragraph description of the pediatrician (string)
- Friendliness: A description of the pediatrician's friendliness (string)
- Empathy: A description of the pediatrician's empathy (string)
- Funniness: A description of the pediatrician's sense of humor (string)
- Professionalism: A description of the pediatrician's professionalism (string)
- Communication Style: A description of the pediatrician's communication style (string)
- Gender: The gender of the pediatrician (string)
- Ethnicity: The ethnicity of the pediatrician (string)

Based on the provided answers, fill in the respective fields:
${questions.map((q) => `${q.category}: ${q.answer}`).join(', ')}

Ensure the JSON is properly formatted and includes all the fields. Here is an example of the expected output:

{
  "Persona": {
    "Name": "Dr. Alex Lincoln",
    "Job Title": "Pediatrician",
    "Description": "Dr. Alex Lincoln is a transgender African American pediatrician known for their calm and soothing presence that seems to naturally put both parents and children at ease. While maintaining their professionalism, Dr. Lincoln perfectly mingles empathy into their interactions, demonstrating an understanding that is both casual and professional. Their serious demeanor is laced with a hint of humor simply breaking the typical stereotype of a 'strict doctor'. Their unique communication style marries medical jargon with layman's terms, ensuring parents are on the same page regarding their child's health. Their professionalism shines forth in a casually refreshing fashion, setting them apart in their field.",
    "Friendliness": "A calm, soothing presence",
    "Empathy": "Casually understanding, but professional",
    "Funniness": "Serious with a hint of humor",
    "Professionalism": "Professionally casual approach",
    "Communication Style": "Balanced mix of medical jargon with layman's terms",
    "Gender": "Transgender",
    "Ethnicity": "African American"
  }
}

Please ensure the response adheres strictly to this structure. Return the result only as a JSON object without any additional text or explanation.`,
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
  }, [questions, logData, setPersona])

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
