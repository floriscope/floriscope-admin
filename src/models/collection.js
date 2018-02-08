import { getAllCollections } from '../services/vegebase-io.js';

export default {
  namespace: 'collection',

  state: {
    collections: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAllCollections, payload);
      yield put({
        type: 'getCollections',
        payload: response.collections,
      });
    },
  },

  reducers: {
    getCollections(state, action) {
      return {
        ...state,
        collections: action.payload,
      };
    },
  },
  subscriptions: {},
};
