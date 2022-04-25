import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { findBalances } from '../utils/friendsHelper'
import Loading from './Loading'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

const FriendsList = ({ friends, transactions, currentUser, loading }) => {
  const [activeTab, setActiveTab] = useState('total')

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

  const totalBalance = { owe: 0, owed: 0 }
  totalBalance.owe = friendBalances
    .filter((b) => Math.sign(b.currentBalance) === -1)
    .reduce((acc, cur) => acc + cur.currentBalance, totalBalance.owe)
  totalBalance.owed = friendBalances
    .filter((b) => Math.sign(b.currentBalance) === 1)
    .reduce((acc, cur) => acc + cur.currentBalance, totalBalance.owed)

  // const TotalBalances = () => (
  //   <div>
  //     <p>you owe ${totalBalance.owe * -1}</p>
  //     <p>you are owed ${totalBalance.owed}</p>
  //   </div>
  // )

  const AllFriends = () =>
    friends.length === 0 ? (
      <p>no friends yet</p>
    ) : (
      <div>
        {friendBalances.map((f) => (
          <div key={f.id}>
            <Link to={`/friends/${f.id}`}>
              <h2>
                {f.name}:{' '}
                {Math.sign(f.currentBalance) === 1
                  ? `owes you $${f.currentBalance}`
                  : `you owe $${f.currentBalance * -1}`}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    )

  const FriendsOweYou = () => {
    if (friends.length === 0) {
      return <p>no friends yet</p>
    }

    const FriendsWhoOwe = friendBalances.filter(
      (b) => Math.sign(b.currentBalance) === 1
    )
    if (FriendsWhoOwe.length === 0) {
      return <p>None of you friends owe you right now</p>
    }

    return (
      <div>
        {FriendsWhoOwe.map((f) => (
          <div key={f.id}>
            <Link to={`/friends/${f.id}`}>
              <h2>
                {f.name}: owes you ${f.currentBalance}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    )
  }

  const FriendsYouOwe = () => {
    if (friends.length === 0) {
      return <p>no friends yet</p>
    }

    const FriendsWhoOwe = friendBalances.filter(
      (b) => Math.sign(b.currentBalance) === -1
    )
    if (FriendsWhoOwe.length === 0) {
      return <p>You don't owe any friends right now</p>
    }

    return (
      <div>
        {FriendsWhoOwe.map((f) => (
          <div key={f.id}>
            <Link to={`/friends/${f.id}`}>
              <h2>
                {f.name}: you owe ${Math.abs(f.currentBalance)}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    )
  }

  const handleSwitchTabs = (tab, event) => {
    event.preventDefault()
    setActiveTab(tab)
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          // p: 2,
          maxWidth: 750,
          display: 'flex',
          // flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
        variant="card"
      >
        <Paper
          elevation={activeTab === 'total' ? 3 : 1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            pt: 2,
            borderRadius: '10px',
            overflow: 'hidden',
            '&:hover': {
              cursor: 'pointer',
            },
            width: 1,
            my: 2,
            ml: 2,
            mr: 1,
          }}
          onClick={(event) => handleSwitchTabs('total', event)}
        >
          <Typography variant="subtitle.1">Total Balance</Typography>
          <Typography
            variant="h4"
            sx={{
              color:
                Math.sign(totalBalance.owe + totalBalance.owed) !== -1
                  ? 'success.main'
                  : 'error.main',
            }}
          >
            ${Math.abs(totalBalance.owe + totalBalance.owed)}
          </Typography>
          <Divider
            sx={{
              borderBottomWidth: 4,
              bgcolor:
                Math.sign(totalBalance.owe + totalBalance.owed) !== -1
                  ? 'success.main'
                  : 'error.main',
              opacity: activeTab === 'total' ? 1 : 0,
              mt: 2,
              mx: -2,
            }}
          />
        </Paper>
        <Paper
          elevation={activeTab === 'owed' ? 3 : 1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            pt: 2,
            borderRadius: '10px',
            overflow: 'hidden',
            '&:hover': {
              cursor: 'pointer',
            },
            width: 1,
            my: 2,
            ml: 1,
            mr: 1,
          }}
          onClick={(event) => handleSwitchTabs('owed', event)}
        >
          <Typography variant="subtitle.1">You are owed</Typography>
          <Typography
            variant="h4"
            sx={{
              color: 'success.main',
            }}
          >
            ${Math.abs(totalBalance.owed)}
          </Typography>
          <Divider
            sx={{
              borderBottomWidth: 4,
              bgcolor: 'success.main',
              opacity: activeTab === 'owed' ? 1 : 0,
              mt: 2,
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
            pt: 2,
            borderRadius: '10px',
            overflow: 'hidden',
            '&:hover': {
              cursor: 'pointer',
            },
            width: 1,
            my: 2,
            ml: 1,
            mr: 2,
          }}
          onClick={(event) => handleSwitchTabs('owe', event)}
        >
          <Typography variant="subtitle.1">You owe</Typography>
          <Typography
            variant="h4"
            sx={{
              color: 'error.main',
            }}
          >
            ${Math.abs(totalBalance.owe)}
          </Typography>
          <Divider
            sx={{
              borderBottomWidth: 4,
              bgcolor: 'error.main',
              opacity: activeTab === 'owe' ? 1 : 0,
              mt: 2,
              mx: -2,
            }}
          />
        </Paper>
      </Paper>

      <h1>Friends</h1>
      {/* {loading ? <Loading /> : <AllFriends />} */}
      {activeTab === 'total' && <AllFriends />}
      {activeTab === 'owed' && <FriendsOweYou />}
      {activeTab === 'owe' && <FriendsYouOwe />}
    </>
  )
}

export default FriendsList
