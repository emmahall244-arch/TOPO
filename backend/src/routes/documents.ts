import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { documentService } from '@/services/documentService'

const router = Router()

// Upload a document
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { projectId, ...docData } = req.body
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }
    const doc = await documentService.uploadDocument(projectId, req.user!.id, docData)
    if (!doc) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.status(201).json(doc)
  } catch (error) {
    console.error('Error uploading document:', error)
    res.status(500).json({ error: 'Failed to upload document' })
  }
})

// Get documents for a project
router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const docs = await documentService.getProjectDocuments(req.params.projectId, req.user!.id)
    if (docs === null) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(docs)
  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

// Get a specific document
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id, req.user!.id)
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' })
    }
    res.json(doc)
  } catch (error) {
    console.error('Error fetching document:', error)
    res.status(500).json({ error: 'Failed to fetch document' })
  }
})

// Delete a document
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const doc = await documentService.deleteDocument(req.params.id, req.user!.id)
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' })
    }
    res.json({ message: 'Document deleted' })
  } catch (error) {
    console.error('Error deleting document:', error)
    res.status(500).json({ error: 'Failed to delete document' })
  }
})

export default router
