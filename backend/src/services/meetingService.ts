import { prisma } from '@/db/client'

export class MeetingService {
  async createMeetingNotes(projectId: string, userId: string, data: {
    date: Date
    attendees?: string
    notes: string
    highlights?: string
  }) {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.meetingNotes.create({
      data: {
        ...data,
        projectId,
        createdById: userId,
      },
    })
  }

  async getProjectMeetingNotes(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.meetingNotes.findMany({
      where: { projectId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: 'desc' },
    })
  }

  async getMeetingNotesById(id: string, userId: string) {
    return prisma.meetingNotes.findFirst({
      where: {
        id,
        project: {
          createdBy: userId,
        },
      },
      include: {
        createdBy: true,
      },
    })
  }

  async updateMeetingNotes(id: string, userId: string, data: Partial<{
    date: Date
    attendees: string
    notes: string
    highlights: string
  }>) {
    const meetingNote = await this.getMeetingNotesById(id, userId)
    if (!meetingNote) {
      return null
    }

    return prisma.meetingNotes.update({
      where: { id },
      data,
    })
  }

  async deleteMeetingNotes(id: string, userId: string) {
    const meetingNote = await this.getMeetingNotesById(id, userId)
    if (!meetingNote) {
      return null
    }

    return prisma.meetingNotes.delete({
      where: { id },
    })
  }

  // Extract highlights from notes (simple implementation)
  // In Phase 2, this will use AI to extract better highlights
  async extractHighlights(notes: string): Promise<string> {
    // Simple extraction: look for bullet points and action items
    const lines = notes.split('\n')
    const highlights = lines.filter(
      (line) =>
        line.startsWith('-') ||
        line.startsWith('•') ||
        line.includes('ACTION') ||
        line.includes('TODO')
    )
    return highlights.join('\n')
  }
}

export const meetingService = new MeetingService()
