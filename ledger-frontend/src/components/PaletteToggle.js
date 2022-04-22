import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const PaletteToggle = ({ paletteMode, changePalette }) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'transparent',
      color: 'text.primary',
      borderRadius: 1,
      p: 3,
      mt: '100%',
      // flexGrow: 1,
    }}
  >
    {paletteMode}
    <IconButton onClick={changePalette}>
      {paletteMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  </Box>
)

export default PaletteToggle
