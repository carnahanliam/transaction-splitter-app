import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Divider from '@mui/material/Divider'
import { dollarFormatter } from '../utils/helperFunctions'

const SingleFriendTransactionsList = ({
  transactions,
  currentUser,
  friend,
}) => {
  const convertDate = (date) => {
    var newDate = new Date(date)
    const day = newDate.getDate().toString().padStart(2, '0')
    const month = newDate.toLocaleDateString('en-US', { month: 'short' })
    const year = newDate.getFullYear()

    return {
      day,
      month,
      year,
    }
  }

  return (
    <Box>
      {transactions
        .sort((a, b) => {
          const aDate = new Date(a.date)
          const bDate = new Date(b.date)
          return bDate - aDate
        })
        .map((t) => {
          const currentUserPaid = t.userSplits.filter(
            (u) => u.user.id === currentUser.id && u.payer
          )

          return (
            <div key={t.id}>
              <Divider />
              <Paper
                component={Link}
                to={`/transactions/${t.id}`}
                elevation={0}
                square
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  py: 1.5,
                  px: 2,
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    cursor: 'pointer',
                    boxShadow:
                      '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
                    backgroundImage:
                      'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
                  },
                  width: 'auto',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="subtitle2">
                    {convertDate(t.date).month}
                  </Typography>
                  <Typography variant="h5">
                    {convertDate(t.date).day}
                  </Typography>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    mx: 2,
                    my: 0.25,
                  }}
                />
                <Box
                  sx={{
                    pr: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      lineHeight: '1.3em',
                      fontSize: '18px',
                    }}
                  >
                    {t.title}
                  </Typography>
                </Box>

                {currentUserPaid.length > 0 && (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        ml: 'auto',
                        pr: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        You paid
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          lineHeight: '1.3em',
                          fontSize: '18px',
                        }}
                      >
                        {dollarFormatter(t.total)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        pr: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {friend.name} owes you
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          lineHeight: '1.3em',
                          fontSize: '18px',
                          color: 'success.light',
                        }}
                      >
                        {dollarFormatter(
                          Math.round(
                            t.total *
                              t.userSplits.find((u) => u.user.id === friend.id)
                                .percent *
                              100
                          ) / 100
                        )}
                      </Typography>
                    </Box>
                  </>
                )}
                {currentUserPaid.length === 0 && (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        ml: 'auto',
                        pr: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {friend.name} paid
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          lineHeight: '1.3em',
                          fontSize: '18px',
                        }}
                      >
                        {dollarFormatter(t.total)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        pr: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        You owe {friend.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          lineHeight: '1.3em',
                          fontSize: '18px',
                          color: 'error.light',
                        }}
                      >
                        {dollarFormatter(
                          Math.round(
                            t.total *
                              t.userSplits.find((u) => u.user.id === friend.id)
                                .percent *
                              100
                          ) / 100
                        )}
                      </Typography>
                    </Box>
                  </>
                )}
                <ArrowForwardIosIcon sx={{ fontSize: '18px', ml: 1.5 }} />
              </Paper>
            </div>
          )
        })}
    </Box>
  )
}

export default SingleFriendTransactionsList
