// CarePlanItemModal.js

'use client'

import React from 'react'
import { Modal, Box, Typography } from '@mui/material'

export default function CarePlanItemModal({ modalOpen, handleCloseModal }) {
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
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
          }}
        >
          Care Plan Modal
        </Typography>
      </Box>
    </Modal>
  )
}
