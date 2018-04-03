import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import onError from './error';
import './rollbar';

import './index.less';

// 0. Set peristence layer
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['global', 'user'],
};
let $persistor;
export function createPersistorIfNecessary(store) {
  if (!$persistor && store) {
    $persistor = persistStore(store);
    const rootReducer = persistReducer(persistConfig, state => state);
    store.replaceReducer(rootReducer);
    $persistor.persist();
  }
  return $persistor;
}

// 1. Initialize
const app = dva({
  onReducer: (reducer) => {
    if (createPersistorIfNecessary(app._store)) {
      const newReducer = persistReducer(persistConfig, reducer);
      setTimeout(() => $persistor && $persistor.persist(), 0);
      return newReducer;
    } else {
      return reducer;
    }
  },
  history: createHistory(),
  onError,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

FastClick.attach(document.body);

export default persistStore(app._store); // eslint-disable-line
