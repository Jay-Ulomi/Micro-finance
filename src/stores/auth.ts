import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, UserPermissions } from '@/types/datastore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userPermissions = computed(() => user.value?.role.permissions || [])
  
  const hasPermission = (permission: string) => {
    return userPermissions.value.some(p => p.resource === permission && p.actions.includes('read'))
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      // Mock login implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        username: credentials.email.split('@')[0],
        firstName: 'John',
        lastName: 'Doe',
        phone: '+255123456789',
        isActive: true,
        lastLogin: new Date(),
        branchId: 'branch-1',
        role: {
          id: 'admin-role',
          name: 'Administrator',
          description: 'Full system access',
          permissions: [
            { resource: 'users', actions: ['read', 'write', 'delete'] },
            { resource: 'loans', actions: ['read', 'write', 'delete'] },
            { resource: 'borrowers', actions: ['read', 'write', 'delete'] },
            { resource: 'savings', actions: ['read', 'write', 'delete'] },
            { resource: 'crm', actions: ['read', 'write', 'delete'] },
            { resource: 'reports', actions: ['read', 'write'] }
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system'
        },
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'Africa/Dar_es_Salaam',
          currency: 'TZS',
          notifications: {
            email: true,
            sms: true,
            push: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      }

      user.value = mockUser
      token.value = 'mock-jwt-token'
      localStorage.setItem('auth_token', token.value)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }
    
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      user.value = { ...user.value, ...updates, updatedAt: new Date() }
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update profile' }
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    userPermissions,
    hasPermission,
    login,
    logout,
    updateProfile
  }
})