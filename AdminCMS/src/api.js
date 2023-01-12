import axios from 'axios'
import ReduxStore from './redux/store'
import { createBrowserHistory } from 'history'
import { BASE_URL } from './utils/constant'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: false,
})

api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
api.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('role')
      ReduxStore.dispatch({ type: 'LOGOUT' })
      createBrowserHistory().push('/auth')
    }
    throw error.response.data.message
  }
)

export default api
