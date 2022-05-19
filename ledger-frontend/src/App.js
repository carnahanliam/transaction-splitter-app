import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import userService from './services/users'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import FriendsList from './components/FriendsList'
import TransactionForm from './components/TransactionForm'
import SingleFriendView from './components/SingleFriendView'
import SingleTransactionView from './components/SingleTransactionView'
import AllTransactionsList from './components/AllTransactionsList'
import AccountSettings from './components/AccountSettings'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import getDesignTokens from './themeMUI'

const App = () => {
  const navigate = useNavigate()

  const loggedInUser = JSON.parse(window.localStorage.getItem('LoggedInUser'))
  const initialUserState = loggedInUser ? loggedInUser : null

  const currentPalette = JSON.parse(window.localStorage.getItem('PaletteMode'))
  const initialPaletteState = currentPalette ? currentPalette : 'dark'

  const [paletteMode, setPaletteMode] = useState(initialPaletteState)
  const [currentUser, setCurrentUser] = useState(initialUserState)
  const [friends, setFriends] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)

  const changePalette = () => {
    setPaletteMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  // check local storage for LoggedInUser on initial render
  useEffect(() => {
    setLoading(true)

    const loggedInUser = JSON.parse(window.localStorage.getItem('LoggedInUser'))
    if (loggedInUser) {
      async function fetchUser() {
        const user = await userService.getUser([loggedInUser.id])
        setCurrentUser(user)
      }
      fetchUser()
    }

    // const palette = JSON.parse(window.localStorage.getItem('PaletteMode'))
    // if (palette) {
    //   setPaletteMode(palette)
    // }
  }, [])

  // on change of currentUser: set LoggedInUser in local storage
  useEffect(() => {
    window.localStorage.setItem('PaletteMode', JSON.stringify(paletteMode))

    window.localStorage.setItem('LoggedInUser', JSON.stringify(currentUser))
    const loggedInUser = JSON.parse(window.localStorage.getItem('LoggedInUser'))

    if (loggedInUser) {
      async function fetchUserDetails() {
        setLoading(true)

        const friends = await userService.getUser(currentUser.friends)
        if (friends.constructor === Object) {
          const friend = [friends]
          setFriends(friend)
        } else {
          setFriends(friends)
        }
        setTransactions(currentUser.transactions)
        setLoading(false)
      }
      fetchUserDetails()
    }
  }, [currentUser, paletteMode])

  const handleLogin = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const userLogin = await loginService.loginUser({ username, password })
      const user = await userService.getUser([userLogin.id])

      // window.localStorage.setItem('LoggedInUser', JSON.stringify(user))
      setCurrentUser(user)
      navigate('/')
    } catch (err) {
      throw err
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    // window.localStorage.removeItem('LoggedInUser')
    setCurrentUser(null)
    setFriends([])
    setTransactions([])
  }

  const handlePhotoUpload = (event) => {
    setUploadedPhoto(event.target.files[0])
  }

  const handlePhotoSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('avatar', uploadedPhoto)
    formData.append('currentUserId', currentUser.id)
    const response = await userService.update(formData)
    const updatedUser = { ...currentUser, picture: response.picture }
    setCurrentUser(updatedUser)
    setUploadedPhoto(null)
  }

  return (
    <>
      <ThemeProvider theme={createTheme(getDesignTokens(paletteMode))}>
        {currentUser === null && (
          <div>
            <LoginForm handleLogin={handleLogin} />
          </div>
        )}

        {currentUser !== null && (
          <>
            <div>
              <Navbar
                currentUser={currentUser}
                handleLogout={handleLogout}
                paletteMode={paletteMode}
                changePalette={changePalette}
              >
                {/* <Navbar currentUser={currentUser} handleLogout={handleLogout} /> */}
                {/* <h2>{currentUser.name} logged in</h2> */}
                {/* <h1>Ledger App</h1> */}
                <Routes>
                  <Route
                    path="/transactions"
                    element={
                      <AllTransactionsList
                        transactions={transactions}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/new-transaction"
                    element={
                      <TransactionForm
                        friends={friends}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/transactions/:id"
                    element={
                      <SingleTransactionView
                        transactions={transactions}
                        currentUser={currentUser}
                        paletteMode={paletteMode}
                      />
                    }
                  />
                  <Route
                    path="/friends/:id"
                    element={
                      <SingleFriendView
                        friends={friends}
                        transactions={transactions}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/account/settings"
                    element={
                      <AccountSettings
                        currentUser={currentUser}
                        //  uploadedPhoto={uploadedPhoto}
                        handlePhotoUpload={handlePhotoUpload}
                        handlePhotoSubmit={handlePhotoSubmit}
                      />
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <FriendsList
                        friends={friends}
                        transactions={transactions}
                        currentUser={currentUser}
                        loading={loading}
                      />
                    }
                  />
                </Routes>
              </Navbar>
            </div>
          </>
        )}
      </ThemeProvider>
      {/* <Footer /> */}
    </>
  )
}

export default App
