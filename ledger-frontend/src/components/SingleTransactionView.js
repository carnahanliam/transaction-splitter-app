import React from 'react'
import { useMatch } from 'react-router-dom'

const SingleTransactionView = ({ transactions, currentUser }) => {
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const transactionDate = myDate.toLocaleDateString('en-US', options)

  const whoPaid = userSplits.find((u) => u.payer).user
  const payerName = whoPaid.id === currentUser.id ? 'You' : whoPaid.name

  const amountsOwed = userSplits.map((u) => {
    if (u.user.id === currentUser.id) {
      return {
        name: 'You',
        amount: Math.round(total * u.percent * 100) / 100,
        id: u.user.id,
      }
    } else {
      return {
        name: u.user.name,
        amount: Math.round(total * u.percent * 100) / 100,
        id: u.user.id,
      }
    }
  })

  return (
    <>
      <h3>{title}</h3>
      <h2>${total}</h2>
      <p>{transactionDate}</p>
      <br />
      <b>
        {payerName} paid ${total}
      </b>
      <ul>
        {amountsOwed.map((u) => (
          <li key={u.id}>
            {u.name} {u.id === currentUser.id ? 'owe' : 'owes'} ${u.amount}
          </li>
        ))}
      </ul>
      <p>comments: {comments}</p>
    </>
  )
}

export default SingleTransactionView
