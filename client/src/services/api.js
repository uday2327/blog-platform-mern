import axios from 'axios';

const baseURL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://blog-platform-mern-p4bj.onrender.com/api');

const API = axios.create({
    baseURL,
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor for global error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Only redirect if not already on the login page to avoid loops
            if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        
        // Standardize the error object returned to the components
        const customError = new Error(
            error.response?.data?.error || error.message || 'An unexpected error occurred'
        );
        customError.status = error.response?.status;
        customError.data = error.response?.data;
        
        return Promise.reject(customError);
    }
);

// Auth services
export const loginUser = (email, password) => API.post('/auth/login', { email, password });
export const registerUser = (userData) => API.post('/auth/register', userData);
export const getMe = () => API.get('/auth/me');

// Post services
export const getPosts = (params) => API.get('/posts', { params });
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (postData) => API.post('/posts', postData);
export const updatePost = (id, postData) => API.put(`/posts/${id}`, postData);
export const deletePost = (id) => API.delete(`/posts/${id}`);

// Comment services
export const getComments = (postId) => API.get(`/posts/${postId}/comments`);
export const addComment = (postId, commentData) => API.post(`/posts/${postId}/comments`, commentData);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// Category services
export const getCategories = () => API.get('/categories');
export const createCategory = (categoryData) => API.post('/categories', categoryData);

// Admin / User services
export const getAdminStats = () => API.get('/users/stats');
export const getUsers = () => API.get('/users');
export const toggleFollow = (userId) => API.post(`/users/${userId}/follow`);
export const toggleBookmark = (postId) => API.post(`/users/bookmarks/${postId}`);
export const toggleLike = (postId) => API.post(`/posts/${postId}/like`);
export const activateMembership = () => API.post('/users/membership');

export default API;
