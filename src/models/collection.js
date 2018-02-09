import { getAllCollections, getCollection, getCollectionSpecimens } from '../services/vegebase-io.js';

export default {
  namespace: 'collection',

  state: {
    collections: [],
    collection: {},
    specimens: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAllCollections);
      yield put({
        type: 'getCollections',
        payload: response.collections,
      });
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(getCollection, payload);
      yield put({
        type: 'getCollection',
        payload: response.collection,
      });
    },
    *fetchSpecimens({ payload }, { call, put }) {
      const response = yield call(getCollectionSpecimens, payload);
      yield put({
        type: 'getCollectionSpecimens',
        payload: response.specimens,
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
    getCollection(state, action) {
      return {
        ...state,
        collection: action.payload,
      };
    },
    getCollectionSpecimens(state, action) {
      return {
        ...state,
        specimens: action.payload,
      };
    },
  },
  subscriptions: {},
};
