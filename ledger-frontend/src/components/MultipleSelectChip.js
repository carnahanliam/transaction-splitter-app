import React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

const ITEM_HEIGHT = 40
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(friend, includedFriends, theme) {
  return {
    fontWeight:
      includedFriends.indexOf(friend) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

const MultipleSelectChip = ({
  friends,
  includedFriends,
  handleIncludedFriendsChange,
  checkMissing,
}) => {
  const theme = useTheme()

  return (
    <>
      <FormControl
        sx={{ width: 1 }}
        required
        error={includedFriends.length === 0 && checkMissing}
      >
        <InputLabel id="multiple-chip-label">Select friends</InputLabel>
        <Select
          labelId="multiple-chip-label"
          id="multiple-chip"
          multiple
          value={includedFriends}
          onChange={handleIncludedFriendsChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Select friends" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((friendObj) => (
                <Chip key={friendObj.id} label={friendObj.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {friends.map((friend) => (
            <MenuItem
              key={friend.id}
              value={friend}
              style={getStyles(friend, includedFriends, theme)}
            >
              {friend.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default MultipleSelectChip
