import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// API methods
export const userApi = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    create: (data) => api.post('/users', data),
};

export const serverApi = {
    getAll: () => api.get('/servers'),
    getById: (id) => api.get(`/servers/${id}`),
    update: (id, data) => api.put(`/servers/${id}`, data),
    delete: (id) => api.delete(`/servers/${id}`),
    create: (data) => api.post('/servers', data),
};

export const statsApi = {
    getOverview: () => api.get('/stats'),
    getActivity: (params) => api.get('/stats/activity', { params }),
};
