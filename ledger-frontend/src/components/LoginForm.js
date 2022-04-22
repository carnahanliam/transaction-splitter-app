import React, { useState } from 'react'
import userService from '../services/users'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
// import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Footer from './Footer'
// import loginImage from '../uploads/finance-app-purple.svg'
// import creditCardImg from '../uploads/Saly-credit-card.svg'
import creditCardImg from '../uploads/Saly-credit-card-cropped.png'
// import rocketImg from '../uploads/Saly-rocket-cropped.png'
import usingPhoneImg from '../uploads/Saly-using-phone-cropped.png'
import blobShadowImg from '../uploads/blob.png'
// import coinImg from '../uploads/Coin_perspective_matte.png'
import './LoginForm.css'

const theme = createTheme()

const LoginForm = ({ handleLogin }) => {
  const [visible, setVisible] = useState('login')

  const showLogin = { display: visible === 'login' ? '' : 'none' }
  const showSignup = { display: visible === 'signup' ? '' : 'none' }

  const handleSignup = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get('newName')
    const username = formData.get('newUsername')
    const password = formData.get('newPassword')

    try {
      await userService.create({ name, username, password })
      setVisible('login')
    } catch (err) {
      throw err
    }
  }

  return (
    // <ThemeProvider theme={theme}>
    <Grid
      container
      component="main"
      sx={{
        height: '100vh',
        backgroundColor: '#e9f6ff',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        minWidth: 900,
        // overflow: 'hidden',
      }}
    >
      <CssBaseline />
      <Grid
        item
        container
        xs={7}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pl: '8vw',
        }}
      >
        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            maxWidth: 760,
          }}
        >
          {/* <Box
              component="img"
              src={coinImg}
              alt="coin"
              sx={{
                width: 55,
                ml: 4,
                position: 'absolute',
                top: '15vh',
                left: '5vw',
                zIndex: 7,
              }}
            /> */}
          <Box
            className="hover"
            component="img"
            src={usingPhoneImg}
            alt="user on phone"
            sx={{
              width: 275,
              ml: 4,
            }}
          />
          <Box
            className="shadow-change"
            component="img"
            src={blobShadowImg}
            alt="shadow"
            sx={{
              width: 260,
              ml: 6,
              filter: 'blur(20px)',
              mt: 5,
              mb: -1,
              zIndex: 5,
            }}
          />
          <Box
            component="img"
            src={creditCardImg}
            alt="stack of credit cards"
            sx={{
              width: 415,
              mt: -20,
              filter: 'drop-shadow(0px 1px 1px #000)',
            }}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
        }}
      >
        <Grid
          sx={{
            my: 6,
            mr: 7,
            ml: '-12vw',
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#f6fafdeb',
            borderRadius: 5,
            boxShadow: '0px 0px 20px 0px rgb(0 0 0 / 10%)',
            maxWidth: 760,
            zIndex: 10,
          }}
          component={Paper}
        >
          <Box
            style={showLogin}
            sx={{
              pt: 7,
              px: '5vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 1,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{
                mt: 1,
                width: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
            <Typography variant="body1" component="h2" align="center">
              Don't have an account?{' '}
              <Button
                variant="text"
                size="small"
                sx={{ ml: 1 }}
                onClick={() => setVisible('signup')}
              >
                Sign up
              </Button>
            </Typography>
          </Box>

          <Box
            style={showSignup}
            sx={{
              pt: 7,
              px: '5vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 1,
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignup}
              noValidate
              sx={{
                mt: 1,
                width: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="newName"
                label="Name"
                name="newName"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="newUsername"
                label="Username"
                name="newUsername"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="Password"
                type="password"
                id="newPassword"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign up
              </Button>
            </Box>
            <Typography variant="body1" component="h2" align="center">
              Already have an account?{' '}
              <Button
                variant="text"
                size="small"
                sx={{ ml: 1 }}
                onClick={() => setVisible('login')}
              >
                Sign in
              </Button>
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 1,
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              Liam Carnahan 2022.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* <Footer xs={12} md={5} bgcolor="transparent" /> */}
    </Grid>
    // </ThemeProvider>
  )
}

export default LoginForm
