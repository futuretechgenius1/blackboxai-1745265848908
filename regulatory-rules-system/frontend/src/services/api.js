import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        default:
          // Handle other errors
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const rulesApi = {
  // Field metadata
  getFieldMetadata: () => 
    api.get('/rules/fields'),

  // Rules CRUD operations
  getRules: (params) => 
    api.get('/rules', { params }),

  getRuleById: (id) => 
    api.get(`/rules/${id}`),

  createRule: (rule) => 
    api.post('/rules', rule),

  updateRule: (id, rule) => 
    api.put(`/rules/${id}`, rule),

  // Export functionality
  exportRules: (params) => 
    api.get('/rules/extract', { 
      params,
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    }),

  // User access
  getUserAccess: () => 
    api.get('/rules/user/access')
};

// Helper function to format error messages
export const formatErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).join(', ');
  }
  return error.message || 'An unexpected error occurred';
};

// Helper function to handle file downloads
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Query keys for React Query
export const queryKeys = {
  rules: 'rules',
  ruleDetail: (id) => ['rule', id],
  fieldMetadata: 'fieldMetadata',
  userAccess: 'userAccess'
};

export default api;
