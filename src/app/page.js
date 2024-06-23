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

const mockFamilyQuestions = [
  {
    question:
      "May I have your name please, before we proceed with your child's information?",
    answer: 'Jose',
  },
  {
    question:
      "Nice to meet you, Jose! Now could you please share your child's full name?",
    answer: 'Gilbert Rodriguez',
  },
  {
    question:
      "It's a pleasure to meet Gilbert, Jose! Could you now provide me with Gilbert's date of birth?",
    answer: '11/08/2015',
  },
  {
    question:
      "Thank you, Jose! Let's move forward understanding more about Gilbert's health. How would you describe Gilbert's birth sex?",
    answer: 'Male',
  },
  {
    question:
      "Thanks for sharing, Jose! Let's delve a bit into Gilbert's birth history. May I know how was Gilbert delivered?",
    answer: 'Vaginal delivery',
  },
  {
    question:
      "That's very helpful, Jose. During Gilbert's birth, were there any complications that the delivering team had to manage? This could involve anything during pregnancy, labor, or delivery.",
    answer: 'No, everything went smoothly',
  },
  {
    question:
      "Great to hear that, Jose! Now, moving forward with Gilbert's medical history, has Gilbert ever been diagnosed with a chronic condition such as asthma, diabetes, and so on?",
    answer: 'No, Gilbert has not been diagnosed with a chronic condition',
  },
  {
    question:
      "I appreciate your openness, Jose. Let's continue. Has Gilbert ever undergone surgeries or been hospitalized for any reason?",
    answer: 'No, Gilbert has never had surgery or been hospitalized',
  },
  {
    question:
      'Has Gilbert ever had any allergic reactions that you know of? It could be to food, medication, or environmental factors.',
    answer: 'No',
  },
  {
    question:
      "I see, well that's a relief, isn't it, Jose? Now, is Gilbert currently taking any prescription medications, over-the-counter medications, or vitamins and supplements?",
    answer: 'Yes, he is taking vitamins and supplements',
  },
  {
    question:
      'Could you please detail which vitamins and supplements Gilbert is currently taking, Jose?',
    answer: 'just general mult-vitamins',
  },
  {
    question:
      "In regard to Gilbert's development, how would you describe his communication skills? Has he started talking yet, and if so, how would you describe his ability?",
    answer: 'He started talking at a normal age and communicates well',
  },
  {
    question:
      "As part of Gilbert's developmental history, it's also helpful to know about his physical progress. So, Jose, at what age did Gilbert start walking?",
    answer: 'Before 9 months',
  },
  {
    question:
      'Oh, Gilbert started walking pretty early! Now, has Gilbert received all his required immunizations as per his age? How up-to-date is his immunization status?',
    answer: 'Completely up-to-date',
  },
  {
    question:
      'Just to cover all grounds, Jose, have there ever been any adverse reactions experienced by Gilbert post his immunizations?',
    answer: 'No, never had any reactions',
  },
  {
    question:
      "Okay, Jose. Now that we've been through most important parts of Gilbert's health history, I'd like to know more about his daily routines. Can you share a bit about Gilbert's diet. What kind of food does he typically eat in a day?",
    answer: 'A balanced diet',
  },
  {
    question:
      "That's wonderful to hear Jose! A balanced diet is crucial for a child's health. But, we are all human and sometimes we can't resist certain foods. Is there any special food Gilbert can't say no to? And do you have any dietary restrictions for Gilbert?",
    answer: 'None',
  },
  {
    question:
      "That's the best way to keep health in check, Jose! Speaking of routines, let's dive into Gilbert's sleeping habits. On average, how many hours of sleep does Gilbert typically get each night?",
    answer: '8',
  },
  {
    question:
      'Sleep quality is just as important as the amount. Does Gilbert usually sleep peacefully, or does he encounter any issues during his bedtime, such as frequent awakenings or night terrors?',
    answer: 'peacfully',
  },
]

export default function Home() {
  const { persona, setPersona } = useDoctor()
  const { family, familyQuestions, setFamilyQuestions } = useFamily()
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
          disabled={!familyQuestions || familyQuestions.length === 0}
          size="small"
          variant="text"
          onClick={() => router.push('/build-family-summary')}
        >
          Jump to family summary
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
          onClick={() => setFamilyQuestions(mockFamilyQuestions)}
        >
          Load mock family questions
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
