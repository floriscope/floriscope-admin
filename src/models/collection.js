import {
  getAllCollections,
  getCollection,
  getCollectionSpecimens,
} from '../services/vegebase-io.js';
import { setAuthority, clearCurrentUser } from '../utils/authority';

export default {
  namespace: 'collection',

  state: {
    collections: {},
    collection: {},
    specimens: {},
    error: false,
    errorMessage: null,
    query: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getAllCollections, payload);
      } catch (err) {
        // Report errors to our store
        yield put({
          type: 'reportFailure',
          payload: err,
        });
      }
      yield put({
        type: 'getCollections',
        payload: response,
        query: payload.q,
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
        payload: response,
      });
    },
  },

  reducers: {
    getCollections(state, action) {
      return {
        ...state,
        query: action.query,
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
    reportFailure(state, err) {
      // console.log('err', err);
      setAuthority('guest');
      clearCurrentUser();
      return {
        ...state,
        error: true,
        errorMessage: err,
        collections: {},
      };
    },
  },
  subscriptions: {},
};
