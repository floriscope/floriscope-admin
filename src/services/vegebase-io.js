import axios from 'axios';
import { getCurrentUser } from '../utils/authority';
import { keysToCamelCase } from '../utils/utils';

const ADMIN_BASE_URL = 'http://api.lvh.me:3000/admin';


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

export async function getAllCollections() {
  try {
    const url = `${ADMIN_BASE_URL}/collections`;
    const collections = await axios.get(url);
    return collections.data;
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
    const specimens = await axios.get(url);
    return specimens.data;
  } catch (e) {
    // console.log(e);
  }
}
