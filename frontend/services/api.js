import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

// User services
export const userService = {
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData)
    return response.data
  },

  updatePassword: async (passwordData) => {
    const response = await api.put("/users/updatepassword", passwordData)
    return response.data
  },

  getAllUsers: async () => {
    const response = await api.get("/users")
    return response.data
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

// Symptom services
export const symptomService = {
  getAllSymptoms: async () => {
    const response = await api.get("/symptoms")
    return response.data
  },

  getSymptom: async (id) => {
    const response = await api.get(`/symptoms/${id}`)
    return response.data
  },

  createSymptom: async (symptomData) => {
    const response = await api.post("/symptoms", symptomData)
    return response.data
  },

  updateSymptom: async (id, symptomData) => {
    const response = await api.put(`/symptoms/${id}`, symptomData)
    return response.data
  },

  deleteSymptom: async (id) => {
    const response = await api.delete(`/symptoms/${id}`)
    return response.data
  },

  getAllCategories: async () => {
    const response = await api.get("/symptoms/categories")
    return response.data
  },

  createCategory: async (categoryData) => {
    const response = await api.post("/symptoms/categories", categoryData)
    return response.data
  },
}

// Symptom Log services
export const symptomLogService = {
  getMyLogs: async () => {
    const response = await api.get("/symptom-logs")
    return response.data
  },

  getLog: async (id) => {
    const response = await api.get(`/symptom-logs/${id}`)
    return response.data
  },

  createLog: async (logData) => {
    const response = await api.post("/symptom-logs", logData)
    return response.data
  },

  updateLog: async (id, logData) => {
    const response = await api.put(`/symptom-logs/${id}`, logData)
    return response.data
  },

  deleteLog: async (id) => {
    const response = await api.delete(`/symptom-logs/${id}`)
    return response.data
  },

  getLogsByDateRange: async (startDate, endDate) => {
    const response = await api.get(`/symptom-logs/range?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },

  getTrends: async (period, symptomId) => {
    const response = await api.get(`/symptom-logs/trends?period=${period}${symptomId ? `&symptomId=${symptomId}` : ""}`)
    return response.data
  },

  getBaseline: async (period, symptomId) => {
    const response = await api.get(
      `/symptom-logs/baseline?period=${period}${symptomId ? `&symptomId=${symptomId}` : ""}`,
    )
    return response.data
  },
}

// Admin services
export const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/stats")
    return response.data
  },

  getAnalytics: async (period, userId) => {
    const response = await api.get(`/admin/analytics?period=${period}${userId ? `&userId=${userId}` : ""}`)
    return response.data
  },

  getUserLogs: async (userId) => {
    const response = await api.get(`/admin/users/${userId}/logs`)
    return response.data
  },

  exportData: async (format, userId) => {
    const response = await api.get(`/admin/export?format=${format}${userId ? `&userId=${userId}` : ""}`)
    return response.data
  },
}

export default api
