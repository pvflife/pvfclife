import api from '../../api'
import { message } from 'antd'
import { createBrowserHistory } from 'history'
import { LOGIN_SUCCESS, LOGOUT, EXPRIED, CLOSE_EXPRIED, SET_PROFILE } from '../constants'

export const initialLogin = data => async dispatch => {
  createBrowserHistory().replace('/?page=1&search=&searchId=&meta=1,2,3')
  return dispatch({ type: LOGIN_SUCCESS, payload: data })
}
export const Login = params => async dispatch => {
  localStorage.setItem('access_token', params.access_token)
  localStorage.setItem('role', params.role)
  return dispatch({ type: LOGIN_SUCCESS, payload: {} })
}
export const Logout = () => async dispatch => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('role')
  createBrowserHistory().replace('/auth')
  return dispatch({ type: LOGOUT })
}

export const NotifyExpried = () => async dispatch => {
  return dispatch({ type: EXPRIED })
}

export const CloseExpried = () => async dispatch => {
  return dispatch({ type: CLOSE_EXPRIED })
}

export const setUserProfile = payload => async dispatch => {
  return dispatch({ type: SET_PROFILE, payload })
}
