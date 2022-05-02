import axios from 'axios'

const baseUrl = 'https://transaction-splitter-app.herokuapp.com/api/login'

const loginUser = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { loginUser }
