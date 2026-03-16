import { prisma } from '@/db/client'
import { Prisma } from '@prisma/client'

export class ProjectService {
  async createProject(userId: string, data: {
    name: string
    address?: string
    acreage?: number
    size?: string
    ownership?: string
    stage?: string
  }) {
    return prisma.project.create({
      data: {
        ...data,
        createdBy: userId,
      },
    })
  }

  async getProjects(userId: string, filters?: {
    stage?: string
    search?: string
  }) {
    const where: Prisma.ProjectWhereInput = {
      createdBy: userId,
    }

    if (filters?.stage) {
      where.stage = filters.stage
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return prisma.project.findMany({
      where,
      include: {
        phases: {
          include: {
            milestones: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
            dueDate: true,
            priority: true,
          },
        },
        _count: {
          select: {
            documents: true,
            contacts: true,
            meetingNotes: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        documents: true,
        phases: {
          include: {
            milestones: true,
          },
        },
        tasks: true,
        contacts: true,
        meetingNotes: true,
        changelogs: {
          orderBy: { changedAt: 'desc' },
          take: 10,
        },
      },
    })

    // Verify ownership
    if (!project || project.createdBy !== userId) {
      return null
    }

    return project
  }

  async updateProject(projectId: string, userId: string, data: Partial<{
    name: string
    address: string
    acreage: number
    size: string
    ownership: string
    stage: string
  }>) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.project.update({
      where: { id: projectId },
      data,
    })
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.project.delete({
      where: { id: projectId },
    })
  }
}

export const projectService = new ProjectService()
