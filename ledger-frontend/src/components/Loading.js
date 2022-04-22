import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const Loading = () => (
  <Box sx={{ display: 'flex' }}>
    <CircularProgress color="inherit" size={20} />
  </Box>
)

export default Loading
