import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { prisma } from '@/db/client'

const router = Router()

// Get change logs for a project
router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res) => {
  try {
    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
    })

    if (!project || project.createdBy !== req.user!.id) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const logs = await prisma.changeLog.findMany({
      where: { projectId: req.params.projectId },
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { changedAt: 'desc' },
    })

    res.json(logs)
  } catch (error) {
    console.error('Error fetching change logs:', error)
    res.status(500).json({ error: 'Failed to fetch change logs' })
  }
})

// Get change logs for a specific task
router.get('/task/:taskId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: { project: true },
    })

    if (!task || task.project.createdBy !== req.user!.id) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const logs = await prisma.changeLog.findMany({
      where: { taskId: req.params.taskId },
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { changedAt: 'desc' },
    })

    res.json(logs)
  } catch (error) {
    console.error('Error fetching change logs:', error)
    res.status(500).json({ error: 'Failed to fetch change logs' })
  }
})

// Get change logs for a specific milestone
router.get('/milestone/:milestoneId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: req.params.milestoneId },
      include: {
        phase: {
          include: { project: true },
        },
      },
    })

    if (!milestone || milestone.phase.project.createdBy !== req.user!.id) {
      return res.status(404).json({ error: 'Milestone not found' })
    }

    const logs = await prisma.changeLog.findMany({
      where: { milestoneId: req.params.milestoneId },
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { changedAt: 'desc' },
    })

    res.json(logs)
  } catch (error) {
    console.error('Error fetching change logs:', error)
    res.status(500).json({ error: 'Failed to fetch change logs' })
  }
})

export default router
