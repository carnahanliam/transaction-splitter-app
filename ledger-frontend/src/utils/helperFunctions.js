export const dollarFormatter = (amount) => {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return formatter.format(amount)
}
