import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, MeetingNotes } from '@/services/api'

export function useMeetings(projectId: string) {
  return useQuery({
    queryKey: ['meetings', projectId],
    queryFn: () => api.getMeetingNotes(projectId),
    enabled: !!projectId,
  })
}

export function useCreateMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<MeetingNotes> }) =>
      api.createMeetingNotes(projectId, data),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', projectId] })
    },
  })
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MeetingNotes> }) =>
      api.updateMeetingNotes(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })
}

export function useCleanupMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.cleanupMeetingNotes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteMeetingNotes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })
}
