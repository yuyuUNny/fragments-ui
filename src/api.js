// src/api.js
// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || 'http://localhost:8080';

export async function getUserFragments (user) {
  console.log('Requesting user fragments data...');
  console.log('Auth headers:', user.authorizationHeaders());
  try {
    const fragmentsUrl = new URL('/v1/fragments?expand=1', apiUrl);
    const res = await fetch(fragmentsUrl, {
      headers: user.authorizationHeaders()
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data.fragments;
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
    throw err;
  }
}

export async function createFragment(user, data, type) {
  const fragmentsUrl = new URL('/v1/fragments', apiUrl);
  // For JSON type convert to string
  const body = type === 'application/json' ? JSON.stringify(data) : data;
  const res = await fetch(fragmentsUrl, {
    method: 'POST',
    headers: {
      ...user.authorizationHeaders(),
      'Content-Type': type
    },
    body
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const responseData = await res.json();
  return responseData;
}
