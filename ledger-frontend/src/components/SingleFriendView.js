import React from 'react'
import { useMatch } from 'react-router-dom'
import { findBalances } from '../utils/friendsHelper'
import defaultAvatar from '../uploads/default-avatar.png'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import SingleFriendTransactionsList from './SingleFriendTransactionsList'

const SingleFriendView = ({ friends, transactions, currentUser }) => {
  var friendBalances = []
  friendBalances = friends.map((f) => ({
    name: f.name,
    id: f.id,
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

  const match = useMatch('/friends/:id')
  const friend = match
    ? friendBalances.find((f) => f.id === match.params.id)
    : null

  if (!friend) {
    return null
  }

  const includesFriendOrUser = transactions.filter((t) => {
    const transactions = t.userSplits.filter((u) => u.user.id === friend.id)
    return transactions.length > 0
  })

  const friendOrUserPaid = includesFriendOrUser.filter((t) => {
    const transactions = t.userSplits.filter(
      (u) =>
        u.payer && (u.user.id === friend.id || u.user.id === currentUser.id)
    )
    return transactions.length > 0
  })

  friendOrUserPaid.map((t) => {
    const borrowed = t.userSplits.filter(
      (u) => u.user.id === friend.id && u.payer
    )

    if (borrowed.length > 0) {
      t.balance = -1
    } else {
      t.balance = 1
    }
    return t
  })

  const friendAvatar = friend.picture ? '/' + friend.picture : defaultAvatar

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          mb: 0.5,
          overflow: 'hidden',
        }}
        variant="card"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 3,
            px: 5,
            // mb: 2,
            borderRadius: '10px',
            overflow: 'hidden',
            width: 'auto',
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
              <Box sx={{ color: 'success.main' }}>
                <Typography
                  variant="subtitle1"
                  align="right"
                  sx={{ mb: '-3px' }}
                >
                  owes you
                </Typography>
                <Typography variant="h5">
                  ${Math.abs(Math.round(friend.currentBalance * 100) / 100)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="right"
                  sx={{ mt: '-5px' }}
                >
                  in total
                </Typography>
              </Box>
            ) : (
              <Box sx={{ color: 'error.main' }}>
                <Typography
                  variant="subtitle1"
                  align="right"
                  sx={{ mb: '-3px' }}
                >
                  you owe
                </Typography>
                <Typography variant="h5">
                  ${Math.abs(Math.round(friend.currentBalance * 100) / 100)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="right"
                  sx={{ mt: '-5px' }}
                >
                  in total
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <SingleFriendTransactionsList
          transactions={friendOrUserPaid}
          currentUser={currentUser}
          friend={friend}
        />
      </Paper>
    </>
  )
}

export default SingleFriendView
