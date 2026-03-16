import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { scheduleService } from '@/services/scheduleService'

const router = Router()

// Create a phase
router.post('/phases', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { projectId, ...phaseData } = req.body
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }
    const phase = await scheduleService.createPhase(projectId, req.user!.id, phaseData)
    if (!phase) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.status(201).json(phase)
  } catch (error) {
    console.error('Error creating phase:', error)
    res.status(500).json({ error: 'Failed to create phase' })
  }
})

// Create a milestone
router.post('/milestones', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { phaseId, ...milestoneData } = req.body
    if (!phaseId) {
      return res.status(400).json({ error: 'phaseId is required' })
    }
    const milestone = await scheduleService.createMilestone(phaseId, req.user!.id, milestoneData)
    if (!milestone) {
      return res.status(404).json({ error: 'Phase not found' })
    }
    res.status(201).json(milestone)
  } catch (error) {
    console.error('Error creating milestone:', error)
    res.status(500).json({ error: 'Failed to create milestone' })
  }
})

// Get schedule for a project
router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const schedule = await scheduleService.getProjectSchedule(req.params.projectId, req.user!.id)
    if (schedule === null) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(schedule)
  } catch (error) {
    console.error('Error fetching schedule:', error)
    res.status(500).json({ error: 'Failed to fetch schedule' })
  }
})

// Update a milestone
router.put('/milestones/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { reason, ...milestoneData } = req.body
    const milestone = await scheduleService.updateMilestone(req.params.id, req.user!.id, milestoneData, reason)
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' })
    }
    res.json(milestone)
  } catch (error) {
    console.error('Error updating milestone:', error)
    res.status(500).json({ error: 'Failed to update milestone' })
  }
})

// Delete a milestone
router.delete('/milestones/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const milestone = await scheduleService.deleteMilestone(req.params.id, req.user!.id)
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' })
    }
    res.json({ message: 'Milestone deleted' })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    res.status(500).json({ error: 'Failed to delete milestone' })
  }
})

export default router
