// care-plan-2/JS/CarePlanItem.js
import React from 'react'
import { Button } from '@mui/material'

const CarePlanItem = ({ style, children, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{ ...style, position: 'absolute' }}
      //   onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default CarePlanItem
