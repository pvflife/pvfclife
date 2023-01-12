import { useState, useEffect, useRef } from 'react';
import * as Screens from './screens';
import * as Components from './components';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider, useSelector, useDispatch } from 'react-redux';
import _store from './redux/store';
import useScreen from './hooks/useScreen';
import * as actions from './redux/actions/auth';
import api from './api';
const history = createBrowserHistory();

function App() {
  return (
    <Provider store={_store}>
      <Router history={history}>
        <Routers />
      </Router>
    </Provider>
  );
}

const Routers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const localtion = useLocation();
  const { status, accessToken } = useSelector((state) => state._auth);
  const [token] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (status) history.push('/');
    else history.push('/auth');
    (async () => {
      try {
        if (token) {
          const { data } = await api.get('/users/profile');
          dispatch(actions.initialLogin(data.data));
        }
      } catch (err) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timeout);
  }, [status, token]);

  useEffect(() => {
    (async () => {
      try {
        if (accessToken) {
          const { data } = await api.get('/users/profile');
          dispatch(actions.initialLogin(data.data));
        }
      } catch (err) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localtion.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [localtion.pathname]);
  const { width } = useScreen();

  return (
    <div style={{ width: width >= 1080 ? width / 4 : width, margin: 'auto' }}>
      {loading ? (
        <Components.Splash />
      ) : (
        <div
          style={{
            paddingBottom: 80,
            width: width >= 1080 ? width / 4 : width,
            margin: 'auto',
          }}
        >
          {!status ? (
            <Switch>
              <Route path="/auth" component={Screens.Login} exact />
              <Route path="/auth/signup" component={Screens.Signup} exact />
            </Switch>
          ) : (
            <>
              <Switch>
                {' '}
                <Route path="/wallet" component={Screens.Wallet} exact />
                <Route
                  path="/detail-profile"
                  component={Screens.DetailProfile}
                  exact
                />
                <Route path="/history" component={Screens.History} exact />
                <Route path="/me" component={Screens.User} exact />
                <Route
                  path="/my-contract"
                  component={Screens.MyContract}
                  exact
                />
                <Route path="/withdraw" component={Screens.Withdraw} exact />
                <Route path="/contracts" component={Screens.Contract} exact />
                <Route path="/cskh" component={Screens.Cskh} exact />
                <Route path="/vay" component={Screens.Vay} exact />
                <Route path="/verify" component={Screens.Verify} exact />
                <Route path="/" component={Screens.Home} exact />
                <Route
                  path="/notifications"
                  component={Screens.Notifications}
                  exact
                />
              </Switch>
            </>
          )}
          {['/', '/wallet', '/services', '/me'].includes(
            localtion.pathname
          ) && (
            <div
              style={{
                position: 'fixed',
                zIndex: 1000,
                bottom: 0,
                width: width >= 1080 ? width / 4 : width,
              }}
            >
              <Components.Navigator />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
