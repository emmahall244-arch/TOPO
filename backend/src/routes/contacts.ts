import { Router } from 'express'
import { AuthRequest, requireAuth } from '@/middleware/auth'
import { contactService } from '@/services/contactService'

const router = Router()

// Create a contact
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { projectId, ...contactData } = req.body
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }
    const contact = await contactService.createContact(projectId, req.user!.id, contactData)
    if (!contact) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.status(201).json(contact)
  } catch (error) {
    console.error('Error creating contact:', error)
    res.status(500).json({ error: 'Failed to create contact' })
  }
})

// Get contacts for a project
router.get('/project/:projectId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const contacts = await contactService.getProjectContacts(req.params.projectId, req.user!.id)
    if (contacts === null) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// Get a specific contact
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const contact = await contactService.getContactById(req.params.id, req.user!.id)
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' })
    }
    res.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({ error: 'Failed to fetch contact' })
  }
})

// Update a contact
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.user!.id, req.body)
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' })
    }
    res.json(contact)
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

// Delete a contact
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const contact = await contactService.deleteContact(req.params.id, req.user!.id)
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' })
    }
    res.json({ message: 'Contact deleted' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({ error: 'Failed to delete contact' })
  }
})

export default router
