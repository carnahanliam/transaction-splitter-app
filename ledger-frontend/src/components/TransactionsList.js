import React from 'react'
import { Link } from 'react-router-dom'

const TransactionsList = ({ transactions, currentUser }) => {
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
      <h2>Transactions</h2>
      <div>
        {transactions.map((t) => {
          const borrowed = t.userSplits.filter(
            (u) => u.user.id === currentUser.id && u.payer
          )

          return (
            <div key={t.id}>
              {convertDate(t.date)}
              {'. '}
              <b>{t.title}</b>
              {'. '}
              <Link to={`/transactions/${t.id}`}>
                {borrowed.length > 0 ? 'You lent $' : 'You borrowed $'}
                {Math.round(
                  t.total *
                    t.userSplits.find((u) => u.user.id === currentUser.id)
                      .percent *
                    100
                ) / 100}
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default TransactionsList
