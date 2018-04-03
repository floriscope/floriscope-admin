import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
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
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['global'],
  blacklist: ['user', 'auth'],
};

const searchPersistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ['collection'],
};

let $persistor;
export function createPersistorIfNecessary(store) {
  if (!$persistor && store) {
    $persistor = persistStore(store);
    const searchReducer = persistReducer(searchPersistConfig, state => state);
    const reducer = persistReducer(rootPersistConfig, searchReducer);
    store.replaceReducer(reducer);
    // store.replaceReducer(searchReducer);
    $persistor.persist();
  }
  return $persistor;
}

// 1. Initialize
const app = dva({
  onReducer: (reducer) => {
    if (createPersistorIfNecessary(app._store)) {
      const newSearchReducer = persistReducer(searchPersistConfig, reducer);
      const newReducer = persistReducer(rootPersistConfig, newSearchReducer);
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
