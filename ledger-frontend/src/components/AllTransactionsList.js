import React from 'react'
import { Link } from 'react-router-dom'
import { dollarFormatter } from '../utils/helperFunctions'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Divider from '@mui/material/Divider'

const AllTransctionsList = ({ transactions, currentUser }) => {
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
    <Paper
      elevation={0}
      sx={{
        maxWidth: 700,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      variant="card"
    >
      <Typography
        variant="h5"
        sx={{
          py: 3,
          pl: 2,
          fontSize: '28px',
        }}
      >
        All Transactions
      </Typography>
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
                    py: 1.5,
                    px: 2,
                    backgroundColor: 'transparent',
                    alignItems: 'center',
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
                      px: 0.5,
                      mt: 0.75,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ lineHeight: '1em' }}>
                      {convertDate(t.date).month}
                    </Typography>
                    <Typography variant="h5" sx={{ lineHeight: '1.3em' }}>
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
                      display: 'flex',
                      alignItems: 'center',
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
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        ml: 'auto',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          width: '290px',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            width: '50%',
                            lineHeight: '1.3em',
                            textAlign: 'end',
                            mr: 2,
                          }}
                        >
                          You paid
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            width: '50%',
                            lineHeight: '1.3em',
                            textAlign: 'start',
                          }}
                        >
                          You are owed
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          width: '290px',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: '1.3em',
                            fontSize: '18px',
                            width: '50%',
                            textAlign: 'end',
                            mr: 2,
                          }}
                        >
                          {dollarFormatter(t.total)}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: '1.3em',
                            fontSize: '18px',
                            color: 'success.light',
                            width: '50%',
                            textAlign: 'start',
                          }}
                        >
                          {dollarFormatter(
                            t.total -
                              Math.round(
                                t.total *
                                  t.userSplits.find(
                                    (u) => u.user.id === currentUser.id
                                  ).percent *
                                  100
                              ) /
                                100
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {currentUserPaid.length === 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        ml: 'auto',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          width: '290px',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            width: '50%',
                            lineHeight: '1.3em',
                            textAlign: 'end',
                            mr: 2,
                          }}
                        >
                          {t.userSplits.find((u) => u.payer).user.name} paid
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            width: '50%',
                            lineHeight: '1.3em',
                            textAlign: 'start',
                          }}
                        >
                          You owe {t.userSplits.find((u) => u.payer).user.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          width: '290px',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: '1.3em',
                            fontSize: '18px',
                            width: '50%',
                            textAlign: 'end',
                            mr: 2,
                          }}
                        >
                          {dollarFormatter(t.total)}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: '1.3em',
                            fontSize: '18px',
                            color: 'error.light',
                            width: '50%',
                            textAlign: 'start',
                          }}
                        >
                          {dollarFormatter(
                            Math.round(
                              t.total *
                                t.userSplits.find(
                                  (u) => u.user.id === currentUser.id
                                ).percent *
                                100
                            ) / 100
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <ArrowForwardIosIcon sx={{ fontSize: '18px', ml: 1.5 }} />
                </Paper>
              </div>
            )
          })}
      </Box>
    </Paper>
  )
}

export default AllTransctionsList
