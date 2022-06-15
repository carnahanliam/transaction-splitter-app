import React, { useState } from 'react'
import TransactionService from '../services/transactions'
import TransDetailsForm from './TransDetailsForm'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TransSplitForm from './TransSplitForm'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'

const steps = ['Add an expense', 'Choose how to split the cost']

const TransactionForm = ({ friends, currentUser }) => {
  const [includedFriends, setIncludedFriends] = useState([])
  const [payer, setPayer] = useState(currentUser)
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [comments, setComments] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [checkMissing, setCheckMissing] = useState(false)

  const handleNext = () => {
    if (title === '' || amount === '' || includedFriends.length === 0) {
      setCheckMissing(true)
      return
    } else {
      setCheckMissing(false)
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAmountChange = (event) => {
    setAmount(event.target.value)
  }

  const handleCommentsChange = (event) => {
    setComments(event.target.value)
  }

  const handleIncludedFriendsChange = (event) => {
    const {
      target: { value },
    } = event
    setIncludedFriends(value)
  }

  const handlePayerChange = (event) => {
    const {
      target: { value },
    } = event
    setPayer(JSON.parse(value))
  }

  const handleNewTransaction = async (event) => {
    event.preventDefault()

    setActiveStep(activeStep + 1)

    const split = includedFriends.concat(currentUser)

    const transaction = {
      title: title,
      total: Number(amount),
      comments: comments,
      userSplits: split.map((u) => ({
        userId: u.id,
        percent: Math.round(100000 / split.length) / 100000,
        payer: u.id === payer.id,
      })),
    }

    await TransactionService.create(transaction)

    setAmount('')
    setComments('')
    setTitle('')
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TransDetailsForm
            handleAmountChange={handleAmountChange}
            handleCommentsChange={handleCommentsChange}
            handleTitleChange={handleTitleChange}
            handleNewTransaction={handleNewTransaction}
            handleIncludedFriendsChange={handleIncludedFriendsChange}
            title={title}
            amount={amount}
            comments={comments}
            friends={friends}
            includedFriends={includedFriends}
            checkMissing={checkMissing}
          />
        )
      case 1:
        return (
          <TransSplitForm
            amount={amount}
            title={title}
            comments={comments}
            includedFriends={includedFriends}
            currentUser={currentUser}
            payer={payer}
            handlePayerChange={handlePayerChange}
          />
        )
      // case 2:
      //   return <Review />
      default:
        throw new Error('Unknown step')
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 700,
        display: 'flex',
        flexDirection: 'column',
        mb: 0.5,
      }}
      variant="card"
    >
      <Typography
        variant="h5"
        sx={{
          mt: 3,
          ml: 2,
          fontSize: 28,
        }}
        align={'center'}
      >
        Add New Expense
      </Typography>
      <Box component="form" onSubmit={handleNewTransaction}>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 4, px: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom align={'center'}>
                Expense added.
              </Typography>
              <Typography variant="subtitle1" align={'center'} sx={{ pb: 3 }}>
                TODO: add confirmation details.
              </Typography>
            </>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  pb: 2,
                  px: 2,
                }}
              >
                {activeStep !== 0 && (
                  <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{ mt: 1, ml: 1, mr: 'auto' }}
                  >
                    Back
                  </Button>
                )}

                {activeStep !== steps.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Next
                  </Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Add expense
                  </Button>
                )}
              </Box>
            </>
          )}
        </>
      </Box>
    </Paper>
  )
}

export default TransactionForm
