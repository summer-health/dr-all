'use client'

import Box from '@mui/material/Box'
import { useDebug } from '../context/debug-context'
import Stack from '@mui/material/Stack'
import Grow from '@mui/material/Grow'

export default function DebugLog() {
  const { log } = useDebug()

  return (
    <Stack direction="column" spacing={2}>
      {log.map((log) => (
        <Grow in={true} key={log.id}>
          <div>
            {log.message}
            {log.data && (
              <Box
                sx={{
                  fontFamily: 'Monospace',
                  fontSize: 12,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 1,
                  padding: 1,
                  overflow: 'auto',
                }}
                component="pre"
              >
                {JSON.stringify(log.data, null, 2)}
              </Box>
            )}
          </div>
        </Grow>
      ))}
    </Stack>
  )
}
