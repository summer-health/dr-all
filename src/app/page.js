'use client'

import { Button, Box, Stack } from '@mui/material'
import { useDoctor } from '@/components/context/doctor-context'
import { useFamily } from '@/components/context/family-context'
import { useRouter } from 'next/navigation'

const mockDoctorPersona = {
  Name: 'Dr. Emma Washington',
  'Job Title': 'Pediatrician',
  Description:
    "Dr. Emma Washington is a attentive and responsible pediatrician known for her supportive and kind approach towards her patients. Her personality umbrages a comforting and secure aura making the child feel at home. Dr. Washington's casual yet professional way of working, builds a trustworthy environment. Best known for her friendly demeanor, Dr. Washington's patience and ability to attentively listen makes her an epitome of empathy. Her sense of humor is quite popular among her young patients ensuring an easy and calm atmosphere during the visits.",
  'Doctor Introduction':
    "Hello there, I'm Dr. Emma Washington, your child's friendly doctor. I'm here to ensure your child's health and happiness with my heartwarming care and comic timings. Be assured, you and your child's worries are my priority.",
  Friendliness: 'Very friendly and warm presence',
  Empathy: 'Highly understanding and a great listener',
  Funniness: 'Easily breaks out light-hearted jokes',
  Professionalism: 'Professional yet casual approach',
  'Communication Style':
    'Smooth communication in simplified medical terminology',
  Gender: 'Female',
  Ethnicity: 'Caucasian',
  Appearance:
    'Dr. Washington has blonde hair up to her shoulders, wears spectacles and often smiles warmly during conversations.',
  imageUrl:
    'https://static.summerhealth.com/images/providers/provider_2AfyzEW74a5V0pIjXABrZU1HxAB/1666051357644/zoidberg.png',
}

export default function Home() {
  const { persona, setPersona } = useDoctor()
  const { family, setFamily } = useDoctor()
  const router = useRouter()
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      <Stack spacing={2} alignItems="center">
        <h1>Welcome to Dr. ALL</h1>
        <h3>(Ali Large Language)</h3>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/build-dr')}
        >
          Start
        </Button>
        <Button
          disabled={!persona?.imageUrl}
          size="small"
          variant="text"
          onClick={() => router.push('/build-family')}
        >
          Jump to family intake
        </Button>
        <Button
          disabled={!family?.summary}
          size="small"
          variant="text"
          onClick={() => router.push('/build-care-plan')}
        >
          Jump to care plan gen
        </Button>
        <Box sx={{ height: 24 }} />
        <Button
          size="small"
          variant="text"
          onClick={() => setPersona(mockDoctorPersona)}
        >
          Load mock doctor persona
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={() => alert('not impelmented')}
        >
          Load mock family data
        </Button>
      </Stack>
    </Stack>
  )
}
