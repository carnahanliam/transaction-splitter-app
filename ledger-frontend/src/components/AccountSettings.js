import React from 'react'
import defaultAvatar from '../uploads/default-avatar.png'

const AccountSettings = ({
  currentUser,
  handlePhotoUpload,
  handlePhotoSubmit,
}) => {
  const displayAvatar = currentUser.picture
    ? currentUser.picture
    : defaultAvatar

  if (currentUser === null) {
    return null
  }

  const avatarStyle = { width: '100px', height: '100px' }

  return (
    <div>
      {/* <img src={avatarSrc} alt="user avatar" style={avatarStyle} /> */}
      <div>account settings for {currentUser.name}</div>
      <form onSubmit={handlePhotoSubmit} encType="multipart/form-data">
        <div>
          Upload new profile picture
          <input
            type="file"
            accept=".png"
            name="avatar"
            onChange={handlePhotoUpload}
          />
        </div>
        <button type="submit">Update</button>
      </form>
      New pic:
      {/* <img src={defaultAvatar} alt="user avatar" style={avatarStyle} /> */}
      <img src={displayAvatar} alt="user avatar" style={avatarStyle} />
    </div>
  )
}

export default AccountSettings
