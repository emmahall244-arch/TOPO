import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { projectService } from '@/services/projectService'

const router = Router()

// Create a new project
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const project = await projectService.createProject(req.user!.id, req.body)
    res.status(201).json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// Get all projects for the user
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { stage, search } = req.query
    const projects = await projectService.getProjects(req.user!.id, {
      stage: stage as string,
      search: search as string,
    })
    res.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Get a specific project
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user!.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// Update a project
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user!.id, req.body)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete a project
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const project = await projectService.deleteProject(req.params.id, req.user!.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json({ message: 'Project deleted' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router
