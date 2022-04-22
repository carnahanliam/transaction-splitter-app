import React from 'react'
import { Link } from 'react-router-dom'
import { findBalances } from '../utils/friendsHelper'
import Loading from './Loading'

const FriendsList = ({ friends, transactions, currentUser, loading }) => {
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

  const TotalBalances = () => (
    <div>
      <p>you owe ${totalBalance.owe * -1}</p>
      <p>you are owed ${totalBalance.owed}</p>
    </div>
  )

  const IndividualBalances = () =>
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

  return (
    <>
      <h2>Total Balance</h2>
      {loading ? <Loading /> : <TotalBalances />}
      <h1>Friends</h1>
      {loading ? <Loading /> : <IndividualBalances />}
    </>
  )
}

export default FriendsList
