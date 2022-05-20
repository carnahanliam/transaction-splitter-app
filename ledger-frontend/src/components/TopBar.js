import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import defaultAvatar from '../uploads/default-avatar.png'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

const TopBar = ({ handleLogout, currentUser }) => {
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const displayAvatar = currentUser.picture
    ? 'https://transaction-splitter-app.herokuapp.com/' + currentUser.picture
    : defaultAvatar

  return (
    <Container
      position="static"
      disableGutters
      maxWidth="md"
      sx={{ marginLeft: 0 }}
    >
      <img
        src="/uploads/1653075893704-529451969-235-2359380_pinhead-patrick-patrick-star-transparent-hd-png-download.png"
        alt="test"
      />
      <Toolbar sx={{ maxWidth: 650 }} disableGutters>
        <Container
          sx={{
            flexGrow: 1,
            display: { xs: 'flex' },
            flexDirection: 'column',
          }}
          disableGutters
        >
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              // flexGrow: 1,
              display: { xs: 'flex' },
              color: 'text.primary',
            }}
          >
            Hello, {currentUser.name}
          </Typography>
          <Typography
            variant="subtitle2"
            noWrap
            component="div"
            sx={{
              // flexGrow: 1,
              display: { xs: 'flex' },
              color: 'text.secondary',
            }}
          >
            Welcome back!
          </Typography>
        </Container>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt={currentUser.name}
                src={displayAvatar}
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '12px',
                  border: '1px solid #e2e2e2e8',
                  bgcolor: '#fff',
                }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            MenuListProps={{ disablePadding: true }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Button
                component={Link}
                // variant="string"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
                to={'/account/settings'}
              >
                Account
              </Button>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  )
}

export default TopBar
