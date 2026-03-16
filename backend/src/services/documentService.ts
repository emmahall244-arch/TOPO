import { prisma } from '@/db/client'

export class DocumentService {
  async uploadDocument(projectId: string, userId: string, data: {
    docType: string
    fileName: string
    fileUrl: string
  }) {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.projectDocument.create({
      data: {
        ...data,
        projectId,
      },
    })
  }

  async getProjectDocuments(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.createdBy !== userId) {
      return null
    }

    return prisma.projectDocument.findMany({
      where: { projectId },
      orderBy: { uploadedAt: 'desc' },
    })
  }

  async getDocumentById(id: string, userId: string) {
    return prisma.projectDocument.findFirst({
      where: {
        id,
        project: {
          createdBy: userId,
        },
      },
    })
  }

  async deleteDocument(id: string, userId: string) {
    const doc = await this.getDocumentById(id, userId)
    if (!doc) {
      return null
    }

    return prisma.projectDocument.delete({
      where: { id },
    })
  }
}

export const documentService = new DocumentService()
