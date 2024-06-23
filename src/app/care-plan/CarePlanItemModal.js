// CarePlanItemModal.js

'use client'

import React from 'react'
import { Modal, Box, Typography } from '@mui/material'
import { useDoctor } from '@/components/context/doctor-context'
import Avatar from '@mui/material/Avatar'

export default function CarePlanItemModal({
  modalOpen,
  handleCloseModal,
  carePlan,
}) {
  const { persona } = useDoctor()
  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        {persona?.doctorAvatar && persona.Name && (
          <Avatar
            src={persona.doctorAvatar}
            alt={persona.Name}
            sx={{ width: 100, height: 100 }}
          />
        )}
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
          }}
        >
          {carePlan?.name}
        </Typography>
        <Typography>{carePlan?.content}</Typography>
      </Box>
    </Modal>
  )
}
