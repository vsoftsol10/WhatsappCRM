// import axios from 'axios';

// console.log("API URL:", import.meta.env.VITE_API_URL);

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // baseURL is empty because we use Vite's proxy `/api`
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor to attach JWT token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;


import axios from 'axios';

console.log("API URL:", import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // baseURL is empty because we use Vite's proxy `/api`
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// On a 401 (expired or invalid token), the backend is telling us the
// session is dead. Previously nothing handled this, so an expired
// token just left the user sitting on a broken page seeing generic
// errors from every request. Clear the stale auth state and send them
// back to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;