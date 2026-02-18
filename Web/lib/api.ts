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

      // Bazı endpointler 204 No Content döner
      if (response.status === 204) {
        return { success: true }
      }

      const text = await response.text()
      let data: any
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`Sunucudan geçersiz yanıt: ${text.slice(0, 100)}`)
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || `HTTP ${response.status}`)
      }

      // Backend zaten { success, data } formatında dönüyorsa olduğu gibi kullan
      // Aksi halde (raw array/object) sarmalayarak döndür
      if (data !== null && typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>
      }
      return { success: true, data: data as T }
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

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
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

  async getUserById(userId: string) {
    return api.get(`/users/${userId}`)
  },

  async getFriends() {
    return api.get('/users/@me/friends')
  },

  async getPendingRequests() {
    return api.get('/users/@me/friend-requests')
  },

  async sendFriendRequest(identifier: string) {
    return api.post('/users/friend-request', { identifier })
  },

  async acceptFriendRequest(requestId: string) {
    return api.put(`/users/@me/friend-requests/${requestId}`)
  },

  async declineFriendRequest(requestId: string) {
    return api.delete(`/users/@me/friend-requests/${requestId}`)
  },

  async removeFriend(userId: string) {
    return api.delete(`/users/@me/friends/${userId}`)
  },

  async blockUser(userId: string) {
    return api.post(`/users/${userId}/block`)
  },

  async updatePresence(status: string, customStatus?: string) {
    return api.patch('/users/@me/presence', { status, customStatus })
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
  async getMessages(channelId: string, limit = 50, before?: string) {
    const query = before
      ? `?limit=${limit}&before=${before}`
      : `?limit=${limit}`
    return api.get(`/channels/${channelId}/messages${query}`)
  },

  async sendMessage(channelId: string, content: string, replyToId?: string) {
    return api.post(`/channels/${channelId}/messages`, {
      content,
      ...(replyToId ? { replyToId } : {}),
    })
  },

  async editMessage(channelId: string, messageId: string, content: string) {
    return api.patch(`/channels/${channelId}/messages/${messageId}`, { content })
  },

  async deleteMessage(channelId: string, messageId: string) {
    return api.delete(`/channels/${channelId}/messages/${messageId}`)
  },

  async sendTyping(channelId: string) {
    return api.post(`/channels/${channelId}/typing`)
  },

  async getDMChannels() {
    return api.get('/channels/dm')
  },

  async createDMChannel(recipientId: string) {
    return api.post('/channels/dm', { recipientId })
  },
}

export { api }
