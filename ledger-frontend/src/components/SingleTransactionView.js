import React from 'react'
import { useMatch } from 'react-router-dom'
import defaultAvatar from '../uploads/default-avatar.png'
import { dollarFormatter } from '../utils/helperFunctions'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

const SingleTransactionView = ({ transactions, currentUser, paletteMode }) => {
  const match = useMatch('/transactions/:id')
  const transaction = match
    ? transactions.find((t) => t.id === match.params.id)
    : null

  if (!transaction) {
    return null
  }

  const { title, total, date, comments, userSplits } = transaction

  var myDate = new Date(date)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const transactionDate = myDate.toLocaleDateString('en-US', options)

  const whoPaid = userSplits.find((u) => u.payer).user
  const payerName = whoPaid.id === currentUser.id ? 'You' : whoPaid.name
  const payerAvatar =
    whoPaid.picture !== null
      ? 'https://transaction-splitter-app.herokuapp.com/' + whoPaid.picture
      : defaultAvatar

  const amountsOwed = userSplits.map((u) => {
    if (u.user.id === currentUser.id) {
      return {
        name: 'You',
        amount: Math.round(total * u.percent * 100) / 100,
        id: u.user.id,
        picture:
          u.user.picture !== null
            ? 'https://transaction-splitter-app.herokuapp.com/' + u.user.picture
            : defaultAvatar,
      }
    } else {
      return {
        name: u.user.name,
        amount: Math.round(total * u.percent * 100) / 100,
        id: u.user.id,
        picture:
          u.user.picture !== null
            ? 'https://transaction-splitter-app.herokuapp.com/' + u.user.picture
            : defaultAvatar,
      }
    }
  })

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
        }}
        variant="card"
      >
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            borderRadius: '10px',
            mx: 2,
            mt: 2,
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h5">{title}</Typography>
            <Typography variant="subtitle2">{transactionDate}</Typography>
          </Box>
          <Typography variant="h4">{dollarFormatter(total)}</Typography>
        </Paper>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Paper
            elevation={1}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              pt: 3,
              pb: 5,
              px: 3,
              borderRadius: '10px',
              margin: '8px 8px 16px 16px',
              width: '60%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: -2,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  width: 'auto',
                  zIndex: '10',
                }}
              >
                <Avatar
                  alt={whoPaid.name}
                  src={payerAvatar}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    border: '1px solid #e2e2e2e8',
                    mr: 2.5,
                    bgcolor: '#fff',
                  }}
                />
                <Typography variant="h6">
                  {payerName} paid {dollarFormatter(total)}
                </Typography>
              </Box>
              <Box
                sx={{
                  'div:last-child > div.wireframe': {
                    borderRadius: '0 0 0 10px',
                  },
                }}
              >
                {amountsOwed.map((u) => (
                  <Box
                    key={u.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      mt: -1,
                    }}
                  >
                    <Box
                      className="wireframe"
                      sx={{
                        border:
                          paletteMode === 'dark'
                            ? '1px solid rgb(55 71 86)'
                            : '1px solid #e0e3e7',
                        borderWidth: '0 0 1px 1px',
                        px: 3,
                        py: 3.5,
                        ml: 3,
                      }}
                    >
                      {''}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        mb: -7,
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        alt={u.name}
                        src={u.picture}
                        sx={{
                          width: 35,
                          height: 35,
                          borderRadius: '10px',
                          border: '1px solid #e2e2e2e8',
                          mr: 1,
                          bgcolor: '#fff',
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ lineHeight: '1.3em' }}
                      >
                        {u.name} {u.id === currentUser.id ? 'owe ' : 'owes '}
                        {dollarFormatter(u.amount)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation={1}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              px: 3,
              pt: 2,
              pb: 3,
              borderRadius: '10px',
              margin: '8px 16px 16px 8px',
              width: '40%',
            }}
          >
            <Typography variant="subtitle2">{comments}</Typography>
          </Paper>
        </Box>
      </Paper>
    </>
  )
}

export default SingleTransactionView
