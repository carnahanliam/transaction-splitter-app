import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { MenuItem, Select } from '@mui/material'

const TransSplitForm = ({
  amount,
  title,
  comments,
  includedFriends,
  currentUser,
  payer,
  handlePayerChange,
}) => {
  // eventually change this when unequal splitting is allowed
  const splitAmount =
    Math.round((100 * amount) / (includedFriends.length + 1)) / 100

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          pt: 4,
        }}
      >
        <Box sx={{ pr: 8 }}>
          <ReceiptLongIcon sx={{ fontSize: '140px' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pb: 2,
          }}
          width={0.55}
        >
          <Typography
            variant="v3"
            sx={{ fontSize: '30px', lineHeight: '32px', pb: 1 }}
            align={'right'}
          >
            {title}
          </Typography>
          <Box
            sx={{
              borderBottom: '3px dotted',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="v2"
              sx={{ fontSize: '56px', lineHeight: '52px' }}
            >
              $
            </Typography>
            <Typography
              variant="v2"
              sx={{ fontSize: '56px', lineHeight: '52px' }}
            >
              {amount}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 6 }}>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mt: 'auto', fontSize: '20px' }}
        >
          Paid by
          <FormControl
            sx={{
              '.MuiChip-root': {
                cursor: 'pointer',
                height: '35px',
              },
            }}
          >
            <Select
              id="payer"
              value={JSON.stringify(payer)}
              onChange={handlePayerChange}
              autoWidth
              renderValue={(selected) => {
                const friendObj = JSON.parse(selected)
                return (
                  <Chip
                    key={friendObj.id}
                    label={friendObj.name}
                    sx={{
                      '.MuiChip-label': {
                        padding: '0 20px 0 6px',
                        fontSize: '18px',
                      },
                    }}
                  />
                )
              }}
              sx={{
                fieldset: { border: '0px' },
                div: { p: '0 5px !important' },
              }}
            >
              <MenuItem
                key={currentUser.id}
                value={JSON.stringify(currentUser)}
              >
                {currentUser.name}
              </MenuItem>
              {includedFriends.map((friend) => (
                <MenuItem key={friend.id} value={JSON.stringify(friend)}>
                  {friend.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          and split
          <FormControl
            disabled
            sx={{
              '.MuiChip-root': {
                cursor: 'pointer',
                height: '35px',
              },
            }}
          >
            <Select
              id="splitEquality"
              defaultValue={'equally'}
              // value={splitEquality}
              // onChange={handleSplitEqualityChange}
              autoWidth
              renderValue={(selected) => (
                <Chip
                  key={selected}
                  label={selected}
                  sx={{
                    '.MuiChip-label': {
                      padding: '0 20px 0 6px',
                      fontSize: '18px',
                    },
                  }}
                />
              )}
              sx={{
                fieldset: { border: '0px' },
                div: { p: '0 5px !important' },
              }}
            >
              <MenuItem value={'equally'}>equally</MenuItem>
              <MenuItem value={'unequally'}>unequally</MenuItem>
            </Select>
          </FormControl>
          <br />
          (everyone pays ${splitAmount}
          ).
          {/* add conditional rendering for message that changes based on split equality and who the user owes / who owes the user */}
        </Typography>
      </Box>
    </Box>
  )
}

export default TransSplitForm
