import { prisma } from '@/db/client'

export class ContactService {
  async createContact(projectId: string, userId: string, data: {
    name: string
    role?: string
    company?: string
    email?: string
    phone?: string
    notes?: string
  }) {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.contact.create({
      data: {
        ...data,
        projectId,
      },
    })
  }

  async getProjectContacts(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.contact.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    })
  }

  async getContactById(id: string, userId: string) {
    return prisma.contact.findFirst({
      where: {
        id,
        project: {
          createdBy: userId,
        },
      },
    })
  }

  async updateContact(id: string, userId: string, data: Partial<{
    name: string
    role: string
    company: string
    email: string
    phone: string
    notes: string
  }>) {
    const contact = await this.getContactById(id, userId)
    if (!contact) {
      return null
    }

    return prisma.contact.update({
      where: { id },
      data,
    })
  }

  async deleteContact(id: string, userId: string) {
    const contact = await this.getContactById(id, userId)
    if (!contact) {
      return null
    }

    return prisma.contact.delete({
      where: { id },
    })
  }
}

export const contactService = new ContactService()
