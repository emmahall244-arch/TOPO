import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { taskService } from '@/services/taskService'

const router = Router()

// Create a task for a project
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { projectId, ...taskData } = req.body
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }
    const task = await taskService.createTask(projectId, req.user!.id, taskData)
    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// Get tasks for a project
router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const tasks = await taskService.getProjectTasks(req.params.projectId, req.user!.id)
    if (tasks === null) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Get a specific task
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user!.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

// Update a task
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { reason, ...taskData } = req.body
    const task = await taskService.updateTask(req.params.id, req.user!.id, taskData, reason)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// Delete a task
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user!.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json({ message: 'Task deleted' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
