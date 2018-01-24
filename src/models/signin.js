import { login } from '../services/auth';
import { setAuthority, setCurrentUser } from '../utils/authority';

export default {
  namespace: 'signin',

  state: {
    status: undefined,
    httpCode: undefined,
  },

  effects: {
    *signin({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { response: { code } } = response;
      // console.log('Try ', response, status);
      // Login successfully
      if (code === 200) {
        // console.log('Signin Success!', code);
        // Login success after permission changes according to UserRole
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        window.location.reload();
        // AlternativeOption: The refresh will automatically redirect to the home page
        // yield put(routerRedux.push('/'));
      } else {
        // Login Failure
        // console.log('Signin Failure!', code);
        yield put({
          type: 'loginFailed',
          payload: response,
        });
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        // yield put(routerRedux.push('/user/login'));
        // Login out after permission changes to admin or user
        // The refresh will automatically redirect to the login page
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            httpCode: undefined,
            currentAuthority: 'guest',
          },
        });
        window.location.reload();
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.user.role);
      setCurrentUser(payload.user);
      return {
        ...state,
        status: payload.user.logged,
        httpCode: payload.status,
        type: 'account',
      };
    },
    loginFailed(state, { payload }) {
      const { response: { code } } = payload;
      return {
        ...state,
        status: false,
        httpCode: code,
        type: 'account',
      };
    },
  },
};
