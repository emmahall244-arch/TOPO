import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { meetingService } from '@/services/meetingService'

const router = Router()

// Create meeting notes
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { projectId, ...noteData } = req.body
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }
    const notes = await meetingService.createMeetingNotes(projectId, req.user!.id, noteData)
    if (!notes) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.status(201).json(notes)
  } catch (error) {
    console.error('Error creating meeting notes:', error)
    res.status(500).json({ error: 'Failed to create meeting notes' })
  }
})

// Get meeting notes for a project
router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const notes = await meetingService.getProjectMeetingNotes(req.params.projectId, req.user!.id)
    if (notes === null) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(notes)
  } catch (error) {
    console.error('Error fetching meeting notes:', error)
    res.status(500).json({ error: 'Failed to fetch meeting notes' })
  }
})

// Get a specific meeting note
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const note = await meetingService.getMeetingNotesById(req.params.id, req.user!.id)
    if (!note) {
      return res.status(404).json({ error: 'Meeting note not found' })
    }
    res.json(note)
  } catch (error) {
    console.error('Error fetching meeting note:', error)
    res.status(500).json({ error: 'Failed to fetch meeting note' })
  }
})

// Update meeting notes
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const notes = await meetingService.updateMeetingNotes(req.params.id, req.user!.id, req.body)
    if (!notes) {
      return res.status(404).json({ error: 'Meeting note not found' })
    }
    res.json(notes)
  } catch (error) {
    console.error('Error updating meeting notes:', error)
    res.status(500).json({ error: 'Failed to update meeting notes' })
  }
})

// Delete meeting notes
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const notes = await meetingService.deleteMeetingNotes(req.params.id, req.user!.id)
    if (!notes) {
      return res.status(404).json({ error: 'Meeting note not found' })
    }
    res.json({ message: 'Meeting note deleted' })
  } catch (error) {
    console.error('Error deleting meeting notes:', error)
    res.status(500).json({ error: 'Failed to delete meeting notes' })
  }
})

// Extract highlights from notes
router.post('/:id/cleanup', requireAuth, async (req: AuthRequest, res) => {
  try {
    const note = await meetingService.getMeetingNotesById(req.params.id, req.user!.id)
    if (!note) {
      return res.status(404).json({ error: 'Meeting note not found' })
    }

    const highlights = await meetingService.extractHighlights(note.notes)
    const updated = await meetingService.updateMeetingNotes(req.params.id, req.user!.id, {
      highlights,
    })
    res.json(updated)
  } catch (error) {
    console.error('Error cleaning up notes:', error)
    res.status(500).json({ error: 'Failed to cleanup notes' })
  }
})

export default router
