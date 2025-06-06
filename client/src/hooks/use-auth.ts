import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        headers: authService.getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth();
          setIsAuthenticated(false);
          return null;
        }
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      return data.user;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return await response.json();
    },
    onSuccess: (data) => {
      authService.setAuth(data);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return await response.json();
    },
    onSuccess: (data) => {
      authService.setAuth(data);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    queryClient.clear();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}