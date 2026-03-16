import axios, { AxiosInstance } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface Project {
  id: string
  name: string
  address?: string
  acreage?: number
  size?: string
  ownership?: string
  stage: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assignedToId?: string
  createdAt: string
}

export interface Milestone {
  id: string
  phaseId: string
  name: string
  dueDate?: string
  status: string
  order: number
}

export interface Phase {
  id: string
  projectId: string
  name: string
  startDate?: string
  endDate?: string
  description?: string
  order: number
  milestones: Milestone[]
}

export interface Contact {
  id: string
  projectId: string
  name: string
  role?: string
  company?: string
  email?: string
  phone?: string
  notes?: string
}

export interface MeetingNotes {
  id: string
  projectId: string
  date: string
  attendees?: string
  notes: string
  highlights?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // Projects
  async getProjects(filters?: { stage?: string; search?: string }) {
    const response = await this.client.get<Project[]>('/api/projects', { params: filters })
    return response.data
  }

  async getProject(id: string) {
    const response = await this.client.get<Project>(`/api/projects/${id}`)
    return response.data
  }

  async createProject(data: Partial<Project>) {
    const response = await this.client.post<Project>('/api/projects', data)
    return response.data
  }

  async updateProject(id: string, data: Partial<Project>) {
    const response = await this.client.put<Project>(`/api/projects/${id}`, data)
    return response.data
  }

  async deleteProject(id: string) {
    await this.client.delete(`/api/projects/${id}`)
  }

  // Tasks
  async getTasks(projectId: string) {
    const response = await this.client.get<Task[]>(`/api/tasks/project/${projectId}`)
    return response.data
  }

  async getTask(id: string) {
    const response = await this.client.get<Task>(`/api/tasks/${id}`)
    return response.data
  }

  async createTask(projectId: string, data: Partial<Task>) {
    const response = await this.client.post<Task>('/api/tasks', {
      projectId,
      ...data,
    })
    return response.data
  }

  async updateTask(id: string, data: Partial<Task>, reason?: string) {
    const response = await this.client.put<Task>(`/api/tasks/${id}`, {
      ...data,
      reason,
    })
    return response.data
  }

  async deleteTask(id: string) {
    await this.client.delete(`/api/tasks/${id}`)
  }

  // Schedule
  async getSchedule(projectId: string) {
    const response = await this.client.get<Phase[]>(`/api/schedule/project/${projectId}`)
    return response.data
  }

  async createPhase(projectId: string, data: Partial<Phase>) {
    const response = await this.client.post<Phase>('/api/schedule/phases', {
      projectId,
      ...data,
    })
    return response.data
  }

  async createMilestone(phaseId: string, data: Partial<Milestone>) {
    const response = await this.client.post<Milestone>('/api/schedule/milestones', {
      phaseId,
      ...data,
    })
    return response.data
  }

  async updateMilestone(id: string, data: Partial<Milestone>, reason?: string) {
    const response = await this.client.put<Milestone>(`/api/schedule/milestones/${id}`, {
      ...data,
      reason,
    })
    return response.data
  }

  async deleteMilestone(id: string) {
    await this.client.delete(`/api/schedule/milestones/${id}`)
  }

  // Contacts
  async getContacts(projectId: string) {
    const response = await this.client.get<Contact[]>(`/api/contacts/project/${projectId}`)
    return response.data
  }

  async createContact(projectId: string, data: Partial<Contact>) {
    const response = await this.client.post<Contact>('/api/contacts', {
      projectId,
      ...data,
    })
    return response.data
  }

  async updateContact(id: string, data: Partial<Contact>) {
    const response = await this.client.put<Contact>(`/api/contacts/${id}`, data)
    return response.data
  }

  async deleteContact(id: string) {
    await this.client.delete(`/api/contacts/${id}`)
  }

  // Meeting Notes
  async getMeetingNotes(projectId: string) {
    const response = await this.client.get<MeetingNotes[]>(`/api/meetings/project/${projectId}`)
    return response.data
  }

  async createMeetingNotes(projectId: string, data: Partial<MeetingNotes>) {
    const response = await this.client.post<MeetingNotes>('/api/meetings', {
      projectId,
      ...data,
    })
    return response.data
  }

  async updateMeetingNotes(id: string, data: Partial<MeetingNotes>) {
    const response = await this.client.put<MeetingNotes>(`/api/meetings/${id}`, data)
    return response.data
  }

  async cleanupMeetingNotes(id: string) {
    const response = await this.client.post<MeetingNotes>(`/api/meetings/${id}/cleanup`)
    return response.data
  }

  async deleteMeetingNotes(id: string) {
    await this.client.delete(`/api/meetings/${id}`)
  }

  // Changelog
  async getProjectChangelog(projectId: string) {
    const response = await this.client.get(`/api/changelogs/project/${projectId}`)
    return response.data
  }

  async getTaskChangelog(taskId: string) {
    const response = await this.client.get(`/api/changelogs/task/${taskId}`)
    return response.data
  }

  async getMilestoneChangelog(milestoneId: string) {
    const response = await this.client.get(`/api/changelogs/milestone/${milestoneId}`)
    return response.data
  }

  // Documents
  async getDocuments(projectId: string) {
    const response = await this.client.get(`/api/documents/project/${projectId}`)
    return response.data
  }

  async uploadDocument(projectId: string, data: any) {
    const response = await this.client.post('/api/documents', {
      projectId,
      ...data,
    })
    return response.data
  }

  async deleteDocument(id: string) {
    await this.client.delete(`/api/documents/${id}`)
  }
}

export const api = new ApiClient()
