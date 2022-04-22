import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import userService from './services/users'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import FriendsList from './components/FriendsList'
import Navbar from './components/Navbar'
import TransactionForm from './components/TransactionForm'
import SingleFriendView from './components/SingleFriendView'
import SingleTransactionView from './components/SingleTransactionView'
import TransactionsList from './components/TransactionsList'
import AccountSettings from './components/AccountSettings'
import Navbar2 from './components/Navbar2'
// import Footer from './components/Footer'

const App = () => {
  const loggedInUser = JSON.parse(window.localStorage.getItem('LoggedInUser'))
  const initialState = loggedInUser ? loggedInUser : null
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(initialState)
  const [friends, setFriends] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)

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
  }, [])

  // on change of currentUser: set LoggedInUser in local storage
  useEffect(() => {
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
  }, [currentUser])

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
      <div className="App">
        {currentUser === null && (
          <div>
            <LoginForm handleLogin={handleLogin} />
          </div>
        )}

        {currentUser !== null && (
          <>
            <div>
              <Navbar2 currentUser={currentUser} handleLogout={handleLogout}>
                {/* <Navbar currentUser={currentUser} handleLogout={handleLogout} /> */}
                {/* <h2>{currentUser.name} logged in</h2> */}
                {/* <h1>Ledger App</h1> */}
                <Routes>
                  <Route
                    path="/transactions"
                    element={
                      <TransactionsList
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
              </Navbar2>
            </div>
          </>
        )}
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default App
