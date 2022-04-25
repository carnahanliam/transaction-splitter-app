import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import defaultAvatar from '../uploads/default-avatar.png'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
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
    ? 'http://localhost:3001/' + currentUser.picture
    : defaultAvatar

  return (
    <Container position="static" maxWidth="xl" disableGutters>
      <Toolbar disableGutters>
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
                  width: 50,
                  height: 50,
                  borderRadius: '15px',
                  border: '1px solid #e2e2e2e8',
                }}
                // variant="rounded"
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
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
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
