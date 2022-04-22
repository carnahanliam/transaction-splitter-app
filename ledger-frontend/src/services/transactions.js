import axios from 'axios'

const baseUrl = '/api/transactions'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const deleteAll = async () => {
  const response = await axios.delete(baseUrl)
  return response.json
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

export default { getAll, deleteAll, create }
