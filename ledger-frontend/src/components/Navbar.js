import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../uploads/logo_transparent.png'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TopBar from './TopBar'
import Container from '@mui/material/Container'
import PaletteToggle from './PaletteToggle'

const drawerWidth = 200

const pages = [
  { name: 'Home', route: '/' },
  { name: 'Transactions', route: '/transactions' },
  { name: 'New Transaction', route: '/new-transaction' },
]

const NavBar = (props) => {
  const { currentUser, handleLogout } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          // height: '12vh',
          // maxHeight: 100,
          // height: 'auto',
          mt: 3,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            height: 'min(12vh, 100px)',
          }}
        />
      </Box>
      <List sx={{ height: '100%', mt: 2 }}>
        {pages.map((page, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            onClick={handleDrawerToggle}
            to={page.route}
            sx={{ px: 1.5, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={page.name} />
          </ListItem>
        ))}
      </List>
      <PaletteToggle
        paletteMode={props.paletteMode}
        changePalette={props.changePalette}
      />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'transparent',
          boxShadow: 'none',
          mt: 3.5,
        }}
      >
        <Toolbar
          sx={{
            height: 'min(12vh, 100px)',
            px: 5,
          }}
          disableGutters
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>
          <TopBar currentUser={currentUser} handleLogout={handleLogout} />
        </Toolbar>
        {/* <Divider /> */}
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 'min(12vh, 100px)',
          px: 5,
          pt: 5,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default NavBar
