import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shopnest-site.onrender.com/api',
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
