import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import userService from './services/users'
import loginService from './services/login'
import transactionService from './services/transactions'
import { LoginForm } from './components/LoginForm'
import { FriendsList } from './components/FriendsList'
import { TransactionForm } from './components/TransactionForm'
import { SingleFriendView } from './components/SingleFriendView'
import SingleTransactionView from './components/SingleTransactionView'
import AllTransactionsList from './components/AllTransactionsList'
import AccountSettings from './components/AccountSettings'
import { Nav } from './components/Nav'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import getDesignTokens from './themeMUI'

import axios from 'axios'

// if backend responds with jwt expired error the user is removed from local storage and page reload will redirect to login page
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.data.message === 'jwt expired') {
      window.localStorage.removeItem('LoggedInUser')
      window.location.reload()
    } else {
      console.log(error.response.data.message)
    }
  }
)

const App = () => {
  const [paletteMode, setPaletteMode] = useState('dark')
  const [currentUser, setCurrentUser] = useState(null)
  const [friends, setFriends] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)

  const navigate = useNavigate()

  const changePalette = () => {
    setPaletteMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const { user, token } = await loginService.loginUser({
        username,
        password,
      })

      window.localStorage.setItem(
        'LoggedInUser',
        JSON.stringify({ ...user, token })
      )
      transactionService.setToken(token)
      setCurrentUser(user)
      navigate('/')
    } catch (error) {
      throw error
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('LoggedInUser')

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

  const addTransaction = async (transactionObj) => {
    const newTransaction = await transactionService.create(transactionObj)
    const updatedUser = {
      ...currentUser,
      transactions: [...currentUser.transactions, newTransaction],
    }
    setCurrentUser(updatedUser)
  }

  // LIFECYCLE

  useEffect(() => {
    setLoading(true)
    const loggedInUser = JSON.parse(window.localStorage.getItem('LoggedInUser'))
    if (loggedInUser) {
      setCurrentUser(loggedInUser)
      transactionService.setToken(loggedInUser.token)
    } else {
      // if token has expired set user to null which will force logout
      setCurrentUser(null)
      setFriends([])
      setTransactions([])
    }

    const userPalette = JSON.parse(window.localStorage.getItem('PaletteMode'))
    if (userPalette) {
      setPaletteMode(userPalette)
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      setLoading(true)
      const friends = currentUser.friends
      if (friends.constructor === Object) {
        const friend = [friends]
        setFriends(friend)
      } else {
        setFriends(friends)
      }
      setTransactions(currentUser.transactions)
      setLoading(false)
    }
  }, [currentUser, transactions])

  useEffect(() => {
    window.localStorage.setItem('PaletteMode', JSON.stringify(paletteMode))
  }, [paletteMode])

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
              <Nav
                currentUser={currentUser}
                handleLogout={handleLogout}
                paletteMode={paletteMode}
                changePalette={changePalette}
              >
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
                        createTransaction={addTransaction}
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
              </Nav>
            </div>
          </>
        )}
      </ThemeProvider>
    </>
  )
}

export default App
