import React, { useState } from 'react'
import { findBalances } from '../../utils/friendsHelper'
import { dollarFormatter } from '../../utils/helperFunctions'
import { SingleFriendBalance } from './SingleFriendBalance'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

const FriendsList = ({ friends, transactions, currentUser }) => {
  const [activeTab, setActiveTab] = useState('total')

  const handleSwitchTabs = (tab, event) => {
    event.preventDefault()
    setActiveTab(tab)
  }

  var friendBalances = []
  friendBalances = friends.map((f) => ({
    name: f.name,
    id: f.id,
    picture: f.picture,
    currentBalance: 0,
  }))

  if (transactions.length !== 0 && friendBalances.length !== 0) {
    const findBals = transactions.map((t) => {
      const tmp = findBalances(t, currentUser)
      return tmp
    })
    const mergeBals = Array.prototype.concat.apply([], findBals)
    const mergeUserBals = mergeBals.reduce((acc, cur) => {
      const duplicate = acc.find((u) => u.id === cur.id)
      if (duplicate) {
        duplicate.currentBalance += cur.currentBalance
      } else {
        acc.push(cur)
      }

      return acc
    }, [])
    const mergeBalsIds = mergeUserBals.map((u) => u.id)
    const updatedFriendBalances = friendBalances.map((user) =>
      mergeBalsIds.includes(user.id)
        ? mergeUserBals.find((obj) => {
            return obj.id === user.id
          })
        : user
    )
    friendBalances = updatedFriendBalances
  }

  const totalBalance = { owe: 0, owed: 0 }
  totalBalance.owe = friendBalances
    .filter((b) => Math.sign(b.currentBalance) === -1)
    .reduce((acc, cur) => acc + cur.currentBalance, totalBalance.owe)
  totalBalance.owed = friendBalances
    .filter((b) => Math.sign(b.currentBalance) === 1)
    .reduce((acc, cur) => acc + cur.currentBalance, totalBalance.owed)

  const DisplayFriends = () => {
    if (friends.length === 0) {
      return <p>No friends yet</p>
    }

    if (activeTab === 'total') {
      return (
        <div>
          {friendBalances.map((f) => (
            <SingleFriendBalance key={f.id} friend={f} />
          ))}
        </div>
      )
    } else if (activeTab === 'owed') {
      const FriendsWhoOwe = friendBalances.filter(
        (b) => Math.sign(b.currentBalance) === 1
      )
      if (FriendsWhoOwe.length === 0) {
        return <p>None of you friends owe you right now</p>
      }

      return (
        <div>
          {FriendsWhoOwe.map((f) => (
            <SingleFriendBalance key={f.id} friend={f} />
          ))}
        </div>
      )
    } else if (activeTab === 'owe') {
      const FriendsYouOwe = friendBalances.filter(
        (b) => Math.sign(b.currentBalance) === -1
      )

      if (FriendsYouOwe.length === 0) {
        return <p>You don't owe any friends right now</p>
      }

      return (
        <div>
          {FriendsYouOwe.map((f) => (
            <SingleFriendBalance key={f.id} friend={f} />
          ))}
        </div>
      )
    }
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          mb: 0.5,
        }}
        variant="card"
      >
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            ml: 2,
            fontSize: 28,
          }}
        >
          Your Balances
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Paper
            elevation={activeTab === 'total' ? 3 : 1}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              px: 2,
              pt: 4,
              borderRadius: '10px',
              overflow: 'hidden',
              '&:hover': {
                cursor: 'pointer',
                boxShadow:
                  '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
                backgroundImage:
                  'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
              },
              width: '66%',
              height: 1,
              mt: 1,
              mb: 2,
              ml: 2,
              mr: 1,
            }}
            onClick={(event) => handleSwitchTabs('total', event)}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mx: 'auto',
              }}
            >
              <Typography variant="h5" sx={{ mb: '-5px' }}>
                Total Balance
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color:
                    Math.sign(totalBalance.owe + totalBalance.owed) !== -1
                      ? 'success.main'
                      : 'error.main',
                }}
              >
                {dollarFormatter(
                  Math.abs(
                    Math.round((totalBalance.owe + totalBalance.owed) * 100) /
                      100
                  )
                )}
              </Typography>
            </Box>
            <Divider
              sx={{
                borderBottomWidth: 6,
                bgcolor:
                  Math.sign(totalBalance.owe + totalBalance.owed) !== -1
                    ? 'success.main'
                    : 'error.main',
                opacity: activeTab === 'total' ? 1 : 0,
                mt: 3,
                mx: -2,
              }}
            />
          </Paper>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '34%',
              mt: 1,
              mb: 2,
              ml: 1,
              mr: 2,
            }}
          >
            <Paper
              elevation={activeTab === 'owed' ? 3 : 1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                px: 2,
                pt: 1,
                borderRadius: '10px',
                overflow: 'hidden',
                '&:hover': {
                  cursor: 'pointer',
                  boxShadow:
                    '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
                },
                mb: 1,
              }}
              onClick={(event) => handleSwitchTabs('owed', event)}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mx: 'auto',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: '13px', lineHeight: '18px' }}
                >
                  You are owed
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'success.main',
                    fontSize: '26px',
                  }}
                >
                  {dollarFormatter(
                    Math.abs(Math.round(totalBalance.owed * 100) / 100)
                  )}
                </Typography>
              </Box>
              <Divider
                sx={{
                  borderBottomWidth: 4,
                  bgcolor: 'success.main',
                  opacity: activeTab === 'owed' ? 1 : 0,
                  mt: 1,
                  mx: -2,
                }}
              />
            </Paper>
            <Paper
              elevation={activeTab === 'owe' ? 3 : 1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                px: 2,
                pt: 1,
                borderRadius: '10px',
                overflow: 'hidden',
                '&:hover': {
                  cursor: 'pointer',
                  boxShadow:
                    '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
                },
                mt: 1,
              }}
              onClick={(event) => handleSwitchTabs('owe', event)}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mx: 'auto',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: '13px', lineHeight: '18px' }}
                >
                  You owe
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'error.main',
                    fontSize: '26px',
                  }}
                >
                  {dollarFormatter(
                    Math.abs(Math.round(totalBalance.owe * 100) / 100)
                  )}
                </Typography>
              </Box>
              <Divider
                sx={{
                  borderBottomWidth: 4,
                  bgcolor: 'error.main',
                  opacity: activeTab === 'owe' ? 1 : 0,
                  mt: 1,
                  mx: -2,
                }}
              />
            </Paper>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          px: 2,
        }}
        variant="card"
      >
        <DisplayFriends />
      </Paper>
    </>
  )
}

export default FriendsList
