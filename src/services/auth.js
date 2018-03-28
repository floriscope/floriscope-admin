// const BASE_URL = 'https://api.vegebase.io';
const BASE_URL = `${process.env.VEGEBASE_API_URL}`;

export async function login(credentials) {
  const url = `${BASE_URL}/auth/sign_in`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  return data;
}
