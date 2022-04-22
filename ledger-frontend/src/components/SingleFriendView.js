import React from 'react'
import { useMatch, Link } from 'react-router-dom'
import { findBalances } from '../utils/friendsHelper'

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

  const convertDate = (date) => {
    var newDate = new Date(date)
    const options = {
      month: 'short',
      day: 'numeric',
    }

    return newDate.toLocaleDateString('en-US', options)
  }

  return (
    <>
      <h2>{friend.name}</h2>
      {/* <h3>Times you borrowed:</h3> */}
      <div>
        {friendOrUserPaid
          .sort((a, b) => {
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)
            return bDate - aDate
          })
          .map((t) => (
            <div key={t.id}>
              {convertDate(t.date)}
              {'. '}
              <b>{t.title}</b>
              {'. '}
              <Link to={`/transactions/${t.id}`}>
                {t.balance === 1 ? 'You lent $' : 'You borrowed $'}
                {Math.round(
                  t.total *
                    t.userSplits.find((u) => u.user.id === currentUser.id)
                      .percent *
                    100
                ) / 100}
              </Link>
            </div>
          ))}
      </div>
    </>
  )
}

export default SingleFriendView
