const getTransactionBalance = (transaction, currentUser) => {
  if (transaction === undefined || !currentUser) {
    return null
  }

  const cost = transaction.total
  const whoPaid = transaction.userSplits.find((u) => u.payer)
  if (whoPaid.user.id !== currentUser.id) {
    const currentUserSplit = transaction.userSplits.find(
      (u) => u.user.id === currentUser.id
    ).percent
    const amountOwed = Math.round(cost * currentUserSplit * 100) / 100
    const balance = [
      {
        id: whoPaid.user.id,
        name: whoPaid.user.name,
        picture: whoPaid.user.picture,
        currentBalance: -1 * amountOwed,
      },
    ]
    return balance
  } else {
    const balance = transaction.userSplits
      .filter((u) => !u.payer)
      .map((u) => ({
        id: u.user.id,
        name: u.user.name,
        picture: u.user.picture,
        currentBalance: Math.round(cost * u.percent * 100) / 100,
      }))
    return balance
  }
}

export const getFriendBalances = (transactions, currentUser, friends) => {
  if (transactions.length === 0) {
    return null
  }

  // find how much each user owes or is owed for each transaction
  const balances = transactions
    .map((t) => {
      const tmp = getTransactionBalance(t, currentUser)
      return tmp
    })
    .flat()

  // combine user's amounts they owe or are owed from all transactions into one balance for each user
  const mergeBalances = balances.reduce((prev, cur) => {
    const duplicate = prev.find((user) => user.id === cur.id)
    if (duplicate) {
      duplicate.currentBalance += cur.currentBalance
    } else {
      prev.push(cur)
    }
    return prev
  }, [])

  const res = friends.map((f) => mergeBalances.find((u) => u.id === f.id))

  return res
}
