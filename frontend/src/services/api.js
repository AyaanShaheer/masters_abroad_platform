import axios from 'axios';

const API_BASE_URL = 'http://172.179.160.255:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  register: (data) => api.post('/auth/register', data),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (data) => api.put('/users/me', data),
  getProfile: () => api.get('/users/me/profile'),
  createProfile: (data) => api.post('/users/me/profile', data),
  updateProfile: (data) => api.put('/users/me/profile', data),
};

// Programs API
export const programsAPI = {
  getPrograms: (params) => api.get('/programs/', { params }),
  getProgram: (id) => api.get(`/programs/${id}`),
  createProgram: (data) => api.post('/programs/', data),
  updateProgram: (id, data) => api.put(`/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/programs/${id}`),
};

// Scholarships API
export const scholarshipsAPI = {
  getScholarships: (params) => api.get('/scholarships/', { params }),
  getScholarship: (id) => api.get(`/scholarships/${id}`),
  createScholarship: (data) => api.post('/scholarships/', data),
  updateScholarship: (id, data) => api.put(`/scholarships/${id}`, data),
  deleteScholarship: (id) => api.delete(`/scholarships/${id}`),
};

// Applications API
export const applicationsAPI = {
  getApplications: () => api.get('/applications/'),
  createApplication: (data) => api.post('/applications/', data),
  updateApplication: (id, data) => api.put(`/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/', data),
  clearSession: (sessionId) => api.delete(`/chat/session?session_id=${sessionId}`),
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: (limit = 10) => api.get(`/recommendations/?limit=${limit}`),
};

// Scraper API
export const scraperAPI = {
  subscribe: (data) => api.post('/scraper/subscribe', data),
  getSubscription: () => api.get('/scraper/subscription'),
  unsubscribe: () => api.delete('/scraper/subscription'),
  getScraped: (skip = 0, limit = 20) => api.get(`/scraper/scraped?skip=${skip}&limit=${limit}`),
  triggerScraping: () => api.post('/scraper/scrape/trigger'),
};

// SOP API
export const sopAPI = {
  generate: (data) => api.post('/sop/generate', data),
  analyze: (data) => api.post('/sop/analyze', data),
  improve: (sopId) => api.post(`/sop/improve/${sopId}`),
  getSops: () => api.get('/sop/'),
  getSop: (id) => api.get(`/sop/${id}`),
  updateSop: (id, data) => api.put(`/sop/${id}`, data),
  deleteSop: (id) => api.delete(`/sop/${id}`),
};

// Admission Prediction API
export const admissionAPI = {
  predict: (data) => api.post('/admission/predict', data),
  analyze: () => api.get('/admission/analyze'),
  getHistory: () => api.get('/admission/history'),
};

export default api;
