import axios from 'axios';

const BASE_URL = 'https://api.vegebase.io/admin';

export async function getAllCollections(params) {
  try {
    const url = `${BASE_URL}/collections`;
    const collections = await axios.get(url, { headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}` },
    });
    return collections.data;
  } catch (e) {
    // console.log(e);
  }
}
