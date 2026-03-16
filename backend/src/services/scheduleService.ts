import { prisma } from '@/db/client'

export class ScheduleService {
  async createPhase(projectId: string, userId: string, data: {
    name: string
    startDate?: Date
    endDate?: Date
    description?: string
    order?: number
  }) {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.phase.create({
      data: {
        ...data,
        projectId,
      },
    })
  }

  async createMilestone(phaseId: string, userId: string, data: {
    name: string
    dueDate?: Date
    status?: string
    order?: number
  }) {
    const phase = await prisma.phase.findUnique({
      where: { id: phaseId },
      include: { project: true },
    })

    if (!phase || phase.project.createdBy !== userId) {
      return null
    }

    return prisma.milestone.create({
      data: {
        ...data,
        phaseId,
      },
    })
  }

  async getProjectSchedule(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.phase.findMany({
      where: { projectId },
      include: {
        milestones: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })
  }

  async updateMilestone(
    milestoneId: string,
    userId: string,
    data: any,
    changeReason?: string
  ) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        phase: {
          include: { project: true },
        },
      },
    })

    if (!milestone || milestone.phase.project.createdBy !== userId) {
      return null
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data,
    })

    // Log changes if reason is provided
    if (changeReason) {
      const changedFields = Object.keys(data)
      for (const field of changedFields) {
        if ((milestone as any)[field] !== data[field]) {
          await prisma.changeLog.create({
            data: {
              recordType: 'milestone',
              recordId: milestoneId,
              projectId: milestone.phase.projectId,
              milestoneId,
              fieldChanged: field,
              oldValue: String((milestone as any)[field]),
              newValue: String(data[field]),
              reason: changeReason,
              changedById: userId,
            },
          })
        }
      }
    }

    return updatedMilestone
  }

  async deleteMilestone(milestoneId: string, userId: string) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        phase: {
          include: { project: true },
        },
      },
    })

    if (!milestone || milestone.phase.project.createdBy !== userId) {
      return null
    }

    return prisma.milestone.delete({
      where: { id: milestoneId },
    })
  }
}

export const scheduleService = new ScheduleService()
