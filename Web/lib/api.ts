// API Client for backend communication
const API_BASE_URL = 'http://localhost/api/v1'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add auth token if exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('discord_access_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'An error occurred')
      }

      return data
    } catch (error: any) {
      console.error('API Error:', error)
      return {
        success: false,
        error: error.message || 'Network error',
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Initialize API client
const api = new ApiClient(API_BASE_URL)

// Auth Service
export const authService = {
  async login(email: string, password: string) {
    return api.post('/auth/login', { email, password })
  },

  async register(data: {
    email: string
    username: string
    displayName: string
    password: string
    dateOfBirth: Date
  }) {
    return api.post('/auth/register', data)
  },

  async logout() {
    return api.post('/auth/logout')
  },

  async refreshToken(refreshToken: string) {
    return api.post('/auth/refresh', { refreshToken })
  },
}

// User Service
export const userService = {
  async getMe() {
    return api.get('/users/@me')
  },

  async updateProfile(data: any) {
    return api.patch('/users/@me', data)
  },
}

// Guild Service
export const guildService = {
  async getGuilds() {
    return api.get('/guilds')
  },

  async getGuild(guildId: string) {
    return api.get(`/guilds/${guildId}`)
  },

  async getChannels(guildId: string) {
    return api.get(`/guilds/${guildId}/channels`)
  },
}

// Message Service
export const messageService = {
  async getMessages(channelId: string, limit = 50) {
    return api.get(`/channels/${channelId}/messages?limit=${limit}`)
  },

  async sendMessage(channelId: string, content: string) {
    return api.post(`/channels/${channelId}/messages`, { content })
  },

  async getDMs() {
    return api.get('/users/@me/channels')
  },
}

export { api }
