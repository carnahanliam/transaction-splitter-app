import React from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import MultipleSelectChip from '../../MultipleSelectChip'

const TransactionDetails = ({
  handleAmountChange,
  handleTitleChange,
  handleCommentsChange,
  handleIncludedFriendsChange,
  friends,
  includedFriends,
  title,
  amount,
  comments,
  checkMissing,
}) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pb: 2,
        }}
      >
        <Grid
          container
          rowSpacing={'15px'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid item>
            <TextField
              required
              id="title"
              name="title"
              label="Expense title"
              fullWidth
              variant="filled"
              value={title}
              onChange={handleTitleChange}
              error={title === '' && checkMissing}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              id="amount"
              name="amount"
              label="Amount ($)"
              fullWidth
              variant="filled"
              value={amount}
              onChange={handleAmountChange}
              error={amount === '' && checkMissing}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            pl: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid item>
            <TextField
              id="comments"
              name="comments"
              label="Add description"
              fullWidth
              multiline
              rows={4}
              variant="filled"
              value={comments}
              onChange={handleCommentsChange}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 0.5,
          pb: 2,
        }}
      >
        <Grid container>
          <Grid item sx={{ width: 1 }}>
            <MultipleSelectChip
              friends={friends}
              includedFriends={includedFriends}
              handleIncludedFriendsChange={handleIncludedFriendsChange}
              checkMissing={checkMissing}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default TransactionDetails
