'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Plane,
  PerspectiveCamera,
  useTexture,
  Sparkles,
  Sky,
} from '@react-three/drei'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { Modal, Box, Card, CardContent, Typography } from '@mui/material'
import CarePlanItemModal from './CarePlanItemModal'
import { Environment } from '@react-three/drei'
import { useCarePlan } from '@/components/context/care-plan-context'
import { carePlanTypes } from '@/libs/care-plan-types'

function getLabel(value) {
  if (value <= 6 || isNaN(value)) {
    return 'Today'
  } else if (value <= 14) {
    return 'Tomorrow'
  } else if (value <= 50) {
    return 'This week'
  } else if (value <= 100) {
    return 'Next week'
  } else if (value <= 200) {
    return 'This month'
  } else if (value <= 400) {
    return 'Next month'
  } else if (value <= 600) {
    return 'Next next month'
  } else {
    return 'Beyond'
  }
}

function Road() {
  const texture = useTexture('/path-repeat-4.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 20)
  texture.colorSpace = THREE.SRGBColorSpace

  const grassTexture = useTexture('/Cartoon_green_texture_grass-pixel.png')
  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(25, 100)

  return (
    <>
      <Plane
        args={[35, 1500]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -35]}
      >
        <meshBasicMaterial map={texture} transparent={true} />
      </Plane>
      <Plane
        args={[500, 3000]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, -35]}
      >
        <meshBasicMaterial map={grassTexture} />
      </Plane>
    </>
  )
}

function CarePlanSprite({ position, url, onClick }) {
  const spriteRef = useRef()
  const texture = useLoader(THREE.TextureLoader, url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  texture.emissive = 0x555555

  return (
    <mesh position={position}>
      <Sparkles count={50} scale={5} size={10} speed={0.4} />
      <sprite
        ref={spriteRef}
        onClick={onClick}
        scale={[5, 5]}
        renderOrder={999}
      >
        <spriteMaterial attach="material" map={texture} transparent />
      </sprite>
    </mesh>
  )
}

function Scene({ cameraZ, onItemClick, items }) {
  const cameraRef = useRef()

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraZ
      cameraRef.current.position.y = 15
      cameraRef.current.position.x = 0
      cameraRef.current.lookAt(0, 0, cameraZ - 30)
    }
  })

  const repeatLength = 5

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        fov={60}
        far={500}
        focus={20}
        position={[0, 5, cameraZ]}
      />
      <Road />
      {items.map((carePlan, index) => {
        const imageUrl = carePlanTypes.includes(carePlan.type)
          ? `/care-plan/${carePlan.type}.png`
          : '/care-plan/developmental.png'
        console.log('----', imageUrl)
        return (
          <>
            <CarePlanSprite
              url={imageUrl}
              position={[-3, 3, 0 - index * repeatLength]}
              onClick={() => onItemClick(carePlan)}
            />
            {/* <CarePlanSprite
              url="/sh-icon.png"
              position={[-1, 0.7, -10 - index * repeatLength]}
              onClick={onItemClick}
            />
            <CarePlanSprite
              url="/sh-icon.png"
              position={[3, 0.7, -20 - index * repeatLength]}
              onClick={onItemClick}
            />

            <CarePlanSprite
              url="/sh-icon.png"
              position={[5, 0.7, -42 - index * repeatLength]}
              onClick={onItemClick}
            />

            <CarePlanSprite
              url="/sh-icon.png"
              position={[-4, 0.7, -56 - index * repeatLength]}
              onClick={onItemClick}
            /> */}
          </>
        )
      })}
    </>
  )
}

export default function CarePlanApp() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [cameraZ, setCameraZ] = useState(10)
  const [rowCount, setRowCount] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCarePlan, setSelectedCarePlan] = useState({})

  const handlePointerDown = useCallback((event) => {
    setIsDragging(true)
    setDragStart(event.clientY)
  }, [])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handlePointerMove = useCallback(
    (event) => {
      if (isDragging) {
        const dragDelta = event.clientY - dragStart
        const newZ = cameraZ - dragDelta * 0.1
        setCameraZ(newZ)
        setDragStart(event.clientY)
      }
    },
    [isDragging, dragStart, cameraZ]
  )

  const addMoreRows = useCallback(() => {
    setRowCount(rowCount + 1)
    setOffsets((prevOffsets) => [...prevOffsets, -prevOffsets.length * 100])
  }, [rowCount])

  const handleItemClick = (carePlan) => {
    console.log(carePlan)
    setSelectedCarePlan(carePlan)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const { carePlan, setCarePlan } = useCarePlan()

  useEffect(() => {
    if (carePlan.length > 0) {
      return
    }
    const fetchCarePlan = async () => {
      try {
        const response = await fetch('/care-plan.json')
        const data = await response.json()
        setCarePlan(data)
      } catch (error) {
        console.error('Error fetching the json file:', error)
      }
    }

    fetchCarePlan()
  }, [carePlan])

  return (
    <>
      <Card
        sx={(theme) => ({
          position: 'absolute',
          top: theme.spacing(8),
          left: theme.spacing(8),
          right: theme.spacing(8),
          width: 'auto',
          zIndex: 99,
        })}
      >
        <CardContent
          sx={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Typography variant="h6">{getLabel((cameraZ - 10) * -1)}</Typography>
        </CardContent>
      </Card>
      <Canvas
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
        flat
      >
        <color attach="background" args={['white']} />
        <fog attach="fog" color={'white'} near={50} far={250} />
        <Scene
          cameraZ={cameraZ}
          addMoreRows={addMoreRows}
          onItemClick={handleItemClick}
          items={carePlan}
        />
      </Canvas>
      <CarePlanItemModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        carePlan={selectedCarePlan}
      />
    </>
  )
}
