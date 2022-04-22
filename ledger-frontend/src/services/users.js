import axios from 'axios'

const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getUser = async (id) => {
  if (id.length === 1) {
    const response = await axios.get(baseUrl + `/${id}`)
    return response.data
  } else {
    const promises = id.map((i) =>
      axios.get(baseUrl + `/${i}`).then((res) => res.data)
    )
    const response = await Promise.all(promises)
    return response
  }
}

const create = async (userObject) => {
  const response = await axios.post(baseUrl, userObject)
  return response.data
}

const update = async (userObject) => {
  const response = await axios.post(`${baseUrl}/update-profile/`, userObject)
  return response.data
}

export default { getAll, getUser, create, update }
