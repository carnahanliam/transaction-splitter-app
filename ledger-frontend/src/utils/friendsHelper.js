export const findBalances = (transaction, currentUser) => {
  if (transaction === undefined || currentUser === null) {
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
        currentBalance: Math.round(cost * u.percent * 100) / 100,
      }))
    return balance
  }
}
