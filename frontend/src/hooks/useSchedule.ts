import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, Phase, Milestone } from '@/services/api'

export function useSchedule(projectId: string) {
  return useQuery({
    queryKey: ['schedule', projectId],
    queryFn: () => api.getSchedule(projectId),
    enabled: !!projectId,
  })
}

export function useCreatePhase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<Phase> }) =>
      api.createPhase(projectId, data),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['schedule', projectId] })
    },
  })
}

export function useCreateMilestone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ phaseId, data }: { phaseId: string; data: Partial<Milestone> }) =>
      api.createMilestone(phaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
    },
  })
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
      reason,
    }: {
      id: string
      data: Partial<Milestone>
      reason?: string
    }) => api.updateMilestone(id, data, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
    },
  })
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteMilestone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
    },
  })
}
