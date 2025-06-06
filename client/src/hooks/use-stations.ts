import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export interface ChargingStation {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: 'active' | 'inactive' | 'maintenance';
  powerOutput: number;
  connectorType: 'type1' | 'type2' | 'ccs' | 'chademo';
  userId: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateStationData {
  userId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  powerOutput: number;
  connectorType: 'type1' | 'type2' | 'ccs' | 'chademo';
}

export function useStations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: stations = [], isLoading } = useQuery({
    queryKey: ['/api/stations'],
    queryFn: async () => {
      const response = await fetch('/api/stations', {
        headers: authService.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }
      return await response.json();
    },
  });

  const createStationMutation = useMutation({
    mutationFn: async (data: CreateStationData) => {
      const response = await apiRequest('POST', '/api/stations', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      toast({
        title: "Success",
        description: "Charging station created successfully",
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

  const updateStationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateStationData> }) => {
      const response = await apiRequest('PUT', `/api/stations/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      toast({
        title: "Success",
        description: "Charging station updated successfully",
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

  const deleteStationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/stations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      toast({
        title: "Success",
        description: "Charging station deleted successfully",
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

  return {
    stations,
    isLoading,
    createStation: createStationMutation.mutate,
    updateStation: updateStationMutation.mutate,
    deleteStation: deleteStationMutation.mutate,
    isCreating: createStationMutation.isPending,
    isUpdating: updateStationMutation.isPending,
    isDeleting: deleteStationMutation.isPending,
  };
}