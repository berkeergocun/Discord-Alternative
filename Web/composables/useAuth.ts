import { authService, userService } from '~/lib/api'

interface User {
  id: string
  email: string
  username: string
  displayName?: string
  avatar?: string
  discriminator?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = useState<boolean>('auth-loading', () => false)

  // Initialize auth - check for existing session
  const initAuth = async () => {
    const token = localStorage.getItem('discord_access_token')
    
    if (!token) {
      isLoading.value = false
      return
    }

    isLoading.value = true

    try {
      const response = await userService.getMe()
      
      if (response.success && response.data) {
        user.value = response.data
      } else {
        // Invalid token, clear auth
        clearAuth()
      }
    } catch (error) {
      console.error('Auth init error:', error)
      clearAuth()
    } finally {
      isLoading.value = false
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    isLoading.value = true

    try {
      const response = await authService.login(email, password)

      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data

        // Store tokens
        localStorage.setItem('discord_access_token', accessToken)
        localStorage.setItem('discord_refresh_token', refreshToken)
        localStorage.setItem('discord_user', JSON.stringify(userData))

        // Set user state
        user.value = userData

        return { success: true, data: userData }
      } else {
        return { 
          success: false, 
          error: response.error || 'Giriş başarısız' 
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.message || 'Bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  // Register
  const register = async (data: {
    email: string
    username: string
    displayName: string
    password: string
    dateOfBirth: Date
  }) => {
    isLoading.value = true

    try {
      const response = await authService.register(data)

      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data

        // Store tokens
        localStorage.setItem('discord_access_token', accessToken)
        localStorage.setItem('discord_refresh_token', refreshToken)
        localStorage.setItem('discord_user', JSON.stringify(userData))

        // Set user state
        user.value = userData

        return { success: true, data: userData }
      } else {
        return { 
          success: false, 
          error: response.error || 'Kayıt başarısız' 
        }
      }
    } catch (error: any) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.message || 'Bir hata oluştu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      navigateTo('/login')
    }
  }

  // Clear auth state
  const clearAuth = () => {
    user.value = null
    localStorage.removeItem('discord_access_token')
    localStorage.removeItem('discord_refresh_token')
    localStorage.removeItem('discord_user')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    initAuth,
    login,
    register,
    logout,
    clearAuth,
  }
}
