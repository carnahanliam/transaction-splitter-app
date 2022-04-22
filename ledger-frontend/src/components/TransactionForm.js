import React, { useState, useEffect } from 'react'
import TransactionService from '../services/transactions'

const TransactionForm = ({ friends, currentUser }) => {
  const [checked, setChecked] = useState([])
  const [payer, setPayer] = useState({
    name: currentUser.name,
    id: currentUser.id,
  })
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [comments, setComments] = useState('')

  const initialState = friends.map((f) => ({
    name: f.name,
    id: f.id,
    included: false,
  }))

  useEffect(() => {
    setChecked(initialState)
  }, [friends])

  const handleIncludedChange = (f) => {
    if (checked.find((u) => u.id === f.id).included && payer.id === f.id) {
      setPayer({ name: currentUser.name, id: currentUser.id })
    }

    setChecked(
      [...checked].map((u) =>
        u.id === f.id ? { ...u, included: !u.included } : u
      )
    )
  }

  const handlePayerChange = (f) => {
    setPayer({ name: f.name, id: f.id })
  }

  const handleNewTransaction = async (event) => {
    event.preventDefault()

    const friendsInSplit = checked.filter((u) => u.included)

    const split = friendsInSplit.concat({
      id: currentUser.id,
      name: currentUser.name,
    })

    const transaction = {
      title: title,
      total: Number(amount),
      comments: comments,
      userSplits: split.map((u) => ({
        userId: u.id,
        percent: Math.round(100 / split.length) / 100,
        payer: u.id === payer.id,
      })),
    }

    await TransactionService.create(transaction)

    setChecked(initialState)
    setAmount('')
    setComments('')
    setTitle('')
  }

  return (
    <>
      <form onSubmit={handleNewTransaction}>
        <div>
          Title
          <input
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Amount
          <input
            name="amount"
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
          />
        </div>
        <div>
          Comments
          <input
            name="comments"
            value={comments}
            onChange={({ target }) => setComments(target.value)}
          />
        </div>
        <div>
          {checked.map((f) => (
            <div key={f.id}>
              {f.name}
              <label>
                <input
                  type="checkbox"
                  checked={checked.find((u) => u.id === f.id).included}
                  onChange={() => handleIncludedChange(f)}
                />
                Split with this user?
              </label>
              {checked.find((u) => u.id === f.id).included && (
                <label>
                  <input
                    type="radio"
                    checked={payer.id === f.id}
                    onChange={() => handlePayerChange(f)}
                  />
                  Did this user pay?
                </label>
              )}
            </div>
          ))}
          <label>
            <input
              type="radio"
              checked={payer.id === currentUser.id}
              onChange={() => handlePayerChange(currentUser)}
            />
            I paid for this transaction
          </label>
        </div>
        <button type="submit">Submit transaction</button>
      </form>
    </>
  )
}

export default TransactionForm
