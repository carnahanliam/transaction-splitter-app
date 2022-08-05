import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../uploads/logo_transparent.png'
import { Topbar } from './Topbar'
import { PaletteToggle } from './PaletteToggle'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AddIcon from '@mui/icons-material/Add'
import Paper from '@mui/material/Paper'

const drawerWidth = 235

const pages = [
  {
    name: 'Home',
    route: '/',
    icon: <AccountBalanceIcon sx={{ fontSize: '25px' }} />,
  },
  {
    name: 'Transactions',
    route: '/transactions',
    icon: <CompareArrowsIcon sx={{ fontSize: '28px' }} />,
  },
  {
    name: 'New Transaction',
    route: '/new-transaction',
    icon: <AddIcon sx={{ fontSize: '28px' }} />,
  },
]

const Nav = (props) => {
  const { currentUser, handleLogout } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        my: '22px',
        ml: '22px',
        borderRadius: '20px',
        height: 1,
        boxShadow: '0px 3px 12px rgb(0 0 0 / 8%)',
      }}
      variant="card"
    >
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
            mt: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              height: 80,
              width: 80,
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
              sx={{ px: 2, py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 45 }}>{page.icon}</ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          ))}
        </List>
        <PaletteToggle
          paletteMode={props.paletteMode}
          changePalette={props.changePalette}
        />
      </Box>
    </Paper>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mr: '22px',
        mb: '22px',
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          position: 'relative',
          height: 'fit-content',
          width: { sm: `calc(100% - ${drawerWidth}px - 22px)` },
          ml: { sm: `calc(22px + ${drawerWidth}px )` },
          backgroundImage: 'none',
          bgcolor: 'background.paper',
          mt: '22px',
          maxWidth: 700,
          borderRadius: '20px',
          border: '1px solid #d8d8d821',
          boxShadow: '0px 3px 12px rgb(0 0 0 / 8%)',
        }}
      >
        <Toolbar
          sx={{
            px: 5,
            py: 1.5,
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
          <Topbar currentUser={currentUser} handleLogout={handleLogout} />
        </Toolbar>
        {/* <Divider sx={{ mt: 1, mx: 2 }} /> */}
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
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
              backgroundColor: 'transparent',
              border: 'none',
              minHeight: 560,
              overflowY: 'hidden',
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
              backgroundColor: 'transparent',
              border: 'none',
              minHeight: 560,
              overflowY: 'hidden',
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
          pt: '22px',
          width: { sm: `calc(100% - ${drawerWidth}px - 22px)` },
          ml: { sm: `calc(22px + ${drawerWidth}px )` },
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default Nav
