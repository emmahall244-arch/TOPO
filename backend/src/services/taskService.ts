import { prisma } from '@/db/client'

export class TaskService {
  async createTask(projectId: string, userId: string, data: {
    title: string
    description?: string
    status?: string
    priority?: string
    dueDate?: Date
  }) {
    return prisma.task.create({
      data: {
        ...data,
        projectId,
        createdById: userId,
      },
    })
  }

  async getProjectTasks(projectId: string, userId: string) {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        changelogs: {
          orderBy: { changedAt: 'desc' },
        },
      },
      orderBy: { dueDate: 'asc' },
    })
  }

  async getTaskById(taskId: string, userId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          createdBy: userId,
        },
      },
      include: {
        assignedTo: true,
        changelogs: {
          orderBy: { changedAt: 'desc' },
        },
      },
    })
  }

  async updateTask(
    taskId: string,
    userId: string,
    data: any,
    changeReason?: string
  ) {
    const task = await this.getTaskById(taskId, userId)
    if (!task) {
      return null
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    })

    // Log changes if reason is provided
    if (changeReason) {
      const changedFields = Object.keys(data)
      for (const field of changedFields) {
        if ((task as any)[field] !== data[field]) {
          await prisma.changeLog.create({
            data: {
              recordType: 'task',
              recordId: taskId,
              projectId: task.projectId,
              taskId,
              fieldChanged: field,
              oldValue: String((task as any)[field]),
              newValue: String(data[field]),
              reason: changeReason,
              changedById: userId,
            },
          })
        }
      }
    }

    return updatedTask
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId, userId)
    if (!task) {
      return null
    }

    return prisma.task.delete({
      where: { id: taskId },
    })
  }
}

export const taskService = new TaskService()
