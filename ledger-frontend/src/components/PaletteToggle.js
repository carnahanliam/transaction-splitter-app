import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const PaletteToggle = ({ paletteMode, changePalette }) => {
  return (
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
      }}
    >
      <IconButton
        onClick={changePalette}
        sx={{
          p: 0,
          height: '42px',
          width: '42px',
          minWidth: '42px',
          borderRadius: '12px',
          border:
            paletteMode === 'dark'
              ? '1px solid rgb(19, 47, 76)'
              : '1px solid #e0e3e7',
        }}
      >
        {paletteMode === 'dark' ? (
          <Brightness7Icon sx={{ color: 'rgb(102, 178, 255)' }} />
        ) : (
          <Brightness4Icon sx={{ color: '#007FFF' }} />
        )}
      </IconButton>
    </Box>
  )
}

export default PaletteToggle
