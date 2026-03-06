const BASE_URL = import.meta.env.VITE_API_KEY;

export async function client(endpoint: string, { body, ...customConfig }: any = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    // Global Error Handling (Infrastruktur)
    if (response.status === 401) {
       window.location.href = '/login';
    }
    // Lempar pesan error agar ditangkap 'catch' di komponen
    return Promise.reject(data.message || 'Terjadi kesalahan sistem');
  }
}