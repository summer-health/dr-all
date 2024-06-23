// CarePlanItemModal.js

'use client'

import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import { useDoctor } from '@/components/context/doctor-context'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import FaceIcon from '@mui/icons-material/Face'
export default function CarePlanItemModal({
  modalOpen,
  handleCloseModal,
  carePlan,
}) {
  const { persona, avatar } = useDoctor()
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
        <Stack spacing={2} alignItems="center">
          {persona && persona.Name && avatar ? (
            <Avatar
              src={avatar}
              alt={persona.Name}
              sx={{ width: 100, height: 100 }}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }}>
              <FaceIcon style={{ fontSize: 60 }} />
            </Avatar>
          )}
        </Stack>
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {carePlan?.name}
        </Typography>
        <Typography>{carePlan?.content}</Typography>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction="row"
        >
          <Button onClick={() => handleCloseModal(carePlan, false)}>
            Close
          </Button>
          <Button
            onClick={() => handleCloseModal(carePlan, true)}
            variant="contained"
          >
            Complete
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
