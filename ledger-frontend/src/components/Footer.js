import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const Footer = (props) => (
  <Grid
    item
    sx={{
      display: 'flex',
      flexDirection: 'column',
      py: 1,
      px: 2,
      position: 'fixed',
      alignItems: 'center',
      bottom: 0,
      right: 0,
      width: 1,
    }}
    {...props}
  >
    <Typography variant="caption" color="text.secondary" align="center">
      Liam Carnahan 2022.
    </Typography>
  </Grid>
)

export default Footer
