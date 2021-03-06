import axios from 'axios';
import { getCurrentUser } from '../utils/authority';
import { keysToCamelCase } from '../utils/utils';

// const ADMIN_BASE_URL = 'https://api.vegebase.io/admin';
const ADMIN_BASE_URL = `${process.env.VEGEBASE_API_URL}/admin`;
// Alter defaults
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// axios.defaults.headers.common.Authorization = AUTH_TOKEN;
if (getCurrentUser()) {
  const currentUser = keysToCamelCase(JSON.parse(getCurrentUser()));
  axios.defaults.headers.common.Authorization = currentUser.authToken;
} else {
  axios.defaults.headers.common.Authorization = null;
}

export async function getAllCollections(payload) {
  try {
    const url = `${ADMIN_BASE_URL}/collections`;
    const response = await axios.get(url, { params: { ...payload } });
    return response.data;
  } catch (e) {
    // console.log(e);
  }
}
export async function getCollection(params) {
  try {
    const url = `${ADMIN_BASE_URL}/collections/${params.uuid}`;
    const collection = await axios.get(url);
    return collection.data;
  } catch (e) {
    // console.log(e);
  }
}
export async function getCollectionSpecimens(params) {
  try {
    const url = `${ADMIN_BASE_URL}/collections/${params.uuid}/specimens`;
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    // console.log(e);
  }
}
