import React from 'react'
import { Link } from 'react-router-dom'
import defaultAvatar from '../../../uploads/default-avatar.png'
import { dollarFormatter } from '../../../utils/helperFunctions'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const SingleFriendBalance = ({ friend }) => {
  const friendAvatar = friend.picture
    ? 'https://transaction-splitter-app.herokuapp.com/' + friend.picture
    : defaultAvatar

  return (
    <Paper
      component={Link}
      to={`/friends/${friend.id}`}
      elevation={1}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: '10px',
        overflow: 'hidden',
        '&:hover': {
          cursor: 'pointer',
          boxShadow:
            '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
        },
        width: 'auto',
        my: 2,
      }}
    >
      <Avatar
        alt={friend.name}
        src={friendAvatar}
        sx={{
          width: 50,
          height: 50,
          borderRadius: '12px',
          border: '1px solid #e2e2e2e8',
          mr: 3,
          bgcolor: '#fff',
        }}
      />
      <Typography variant="h5">{friend.name}</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ml: 'auto',
        }}
      >
        {Math.sign(friend.currentBalance) === 1 ? (
          <Box sx={{ color: 'success.light' }}>
            <Typography variant="subtitle1" align="right" sx={{ mb: '-3px' }}>
              owes you
            </Typography>
            <Typography variant="h5">
              {dollarFormatter(
                Math.abs(Math.round(friend.currentBalance * 100) / 100)
              )}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ color: 'error.light' }}>
            <Typography variant="subtitle1" align="right" sx={{ mb: '-3px' }}>
              you owe
            </Typography>
            <Typography variant="h5">
              {dollarFormatter(
                Math.abs(Math.round(friend.currentBalance * 100) / 100)
              )}
            </Typography>
          </Box>
        )}
      </Box>
      <ArrowForwardIosIcon sx={{ fontSize: '20px', ml: 2 }} />
    </Paper>
  )
}

export default SingleFriendBalance
