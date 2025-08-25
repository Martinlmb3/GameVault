import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient, setAuthData, type LoginRequest, type SignupRequest, type AuthResponse, type ProfileRequest, type ProfileResponse, type GameRequest, type GameResponse } from './api'

export const useLoginMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest): Promise<AuthResponse> => {
      return apiClient.login(data)
    },
    onSuccess: (response: AuthResponse) => {
      // Save auth data to localStorage
      setAuthData(response)
      
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      router.push('/my-games')
    },
    onError: (error) => {
      console.error('Login failed:', error)
      // Error handling is done in the component
    }
  })
}

export const useSignupMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignupRequest): Promise<AuthResponse> => {
      return apiClient.signup(data)
    },
    onSuccess: (response: AuthResponse) => {
      // Save auth data to localStorage
      setAuthData(response)
      
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Redirect to my-games page
      router.push('/my-games')
    },
    onError: (error) => {
      console.error('Signup failed:', error)
      // Error handling is done in the component
    }
  })
}

export const useRefreshTokenMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (): Promise<AuthResponse> => {
      return apiClient.refreshToken()
    },
    onSuccess: (response: AuthResponse) => {
      // Update auth data in localStorage
      setAuthData(response)
      
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Token refresh failed:', error)
      // Could redirect to login page here if needed
    }
  })
}

export const useLogoutMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.logout()
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      
      // Redirect to home page
      router.push('/')
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local data and redirect
      queryClient.clear()
      router.push('/')
    }
  })
}

// Profile query hooks
export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: (): Promise<ProfileResponse> => {
      return apiClient.getProfile()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  })
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfileRequest): Promise<ProfileResponse> => {
      return apiClient.updateProfile(data)
    },
    onSuccess: (updatedProfile: ProfileResponse) => {
      // Update the profile query cache
      queryClient.setQueryData(['profile'], updatedProfile)
      
      // Update localStorage user data
      if (typeof window !== 'undefined') {
        const currentAuth = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedAuth = {
          ...currentAuth,
          username: updatedProfile.username,
          image: updatedProfile.image
        }
        localStorage.setItem('user', JSON.stringify(updatedAuth))
      }
      
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Profile update failed:', error)
    }
  })
}

// Game query hooks
export const useAllGamesQuery = () => {
  return useQuery({
    queryKey: ['games', 'all'],
    queryFn: (): Promise<GameResponse[]> => {
      return apiClient.getAllGames()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useMyGamesQuery = () => {
  return useQuery({
    queryKey: ['games', 'my'],
    queryFn: (): Promise<GameResponse[]> => {
      return apiClient.getMyGames()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: GameRequest): Promise<GameResponse> => {
      return apiClient.createGame(data)
    },
    onSuccess: () => {
      // Invalidate game queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['games'] })
      
      // Redirect to my-games page
      router.push('/my-games')
    },
    onError: (error) => {
      console.error('Game creation failed:', error)
    }
  })
}

export const useUpdateGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GameRequest }): Promise<GameResponse> => {
      return apiClient.updateGame(id, data)
    },
    onSuccess: () => {
      // Invalidate game queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
    onError: (error) => {
      console.error('Game update failed:', error)
    }
  })
}

export const useDeleteGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return apiClient.deleteGame(id)
    },
    onSuccess: () => {
      // Invalidate game queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
    onError: (error) => {
      console.error('Game deletion failed:', error)
    }
  })
}