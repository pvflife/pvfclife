import React from 'react'
import _store from './redux/store'
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { Login, Layout, Users, UserDetail, Staff, Statistics, Request } from './containers'
import { Splash } from './components'
import * as actions from './redux/actions/auth'
import './App.scss'
const _history = createBrowserHistory()

const AuthorizedRoutes = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { status } = useSelector(state => state._auth)
  const [ROLE] = React.useState(localStorage.getItem('role'))
  const location = useLocation()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    const tokenFromStorage = localStorage.getItem('access_token')

    if (tokenFromStorage) dispatch(actions.initialLogin())
    if (!status) history.replace('/auth')
    else history.replace('/?page=1&search=&searchId=&meta=1,2,3')
  }, [status])
  return (
    <>
      <>
        {status ? (
          <Layout>
            <Switch>
              <Route path="/" exact>
                <Users />
              </Route>
              <Route path="/detail">
                <UserDetail />
              </Route>
              <Route path="/staffs">
                <Staff />
              </Route>
              <Route path="/requests">
                <Request />
              </Route>
              <Route path="/statistics">
                <Statistics />
              </Route>
            </Switch>
          </Layout>
        ) : (
          <Switch>
            <Route exact path="/auth">
              <Login />
            </Route>
          </Switch>
        )}
      </>
    </>
  )
}

function App() {
  return (
    <Provider store={_store}>
      <Router history={_history}>
        <AuthorizedRoutes />
      </Router>
    </Provider>
  )
}

export default App
