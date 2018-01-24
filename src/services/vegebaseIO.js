const BASE_URL = 'https://api.vegebase.io/admin';

export async function getAllCollections(params) {
  const url = `${BASE_URL}/collections`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error while fetching requested collections');
  }
  const data = await response.json();
  return data;
}
