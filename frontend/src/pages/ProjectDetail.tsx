import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import MeetingsPanel from '@/components/MeetingsPanel'
import { useProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects'
import { useTasks, useCreateTask } from '@/hooks/useTasks'
import { useContacts, useCreateContact } from '@/hooks/useContacts'
import styles from './ProjectDetail.module.css'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(id || '')
  const { data: tasks } = useTasks(id || '')
  const { data: contacts } = useContacts(id || '')
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const createTask = useCreateTask()
  const createContact = useCreateContact()

  const [activeTab, setActiveTab] = useState<'info' | 'tasks' | 'contacts' | 'meetings'>('info')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(project ?? { name: '', address: '', acreage: 0, size: '', ownership: '', stage: 'planning' } as any)
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', status: 'pending' })
  const [newContact, setNewContact] = useState({ name: '', role: '', company: '', email: '' })

  if (projectLoading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  const handleSave = async () => {
    try {
      await updateProject.mutateAsync({ id: project.id, data: formData })
      setEditMode(false)
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(project.id)
        navigate('/')
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTask.mutateAsync({ projectId: project.id, data: newTask })
      setNewTask({ title: '', priority: 'medium', status: 'pending' })
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createContact.mutateAsync({ projectId: project.id, data: newContact })
      setNewContact({ name: '', role: '', company: '', email: '' })
    } catch (error) {
      console.error('Failed to create contact:', error)
    }
  }

  return (
    <>
      <Navigation />
      <div className={`container p-2 ${styles.detail}`}>
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>← Back to Projects</Link>
          <div className={styles.actions}>
            {!editMode && (
              <>
                <Link to={`/scheduling/${id}`} className="primary">
                  Schedule
                </Link>
                <button className="secondary" onClick={() => setEditMode(true)}>
                  Edit
                </button>
                <button className="secondary" onClick={handleDelete} style={{ color: 'var(--color-danger)' }}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={activeTab === 'info' ? styles.active : ''}
            onClick={() => setActiveTab('info')}
          >
            Project Info
          </button>
          <button
            className={activeTab === 'tasks' ? styles.active : ''}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks ({tasks?.length || 0})
          </button>
          <button
            className={activeTab === 'contacts' ? styles.active : ''}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts ({contacts?.length || 0})
          </button>
          <button
            className={activeTab === 'meetings' ? styles.active : ''}
            onClick={() => setActiveTab('meetings')}
          >
            Meetings
          </button>
        </div>

        {activeTab === 'info' && (
          <div className={styles.content}>
            {editMode ? (
              <form className={styles.form}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Acreage</label>
                  <input
                    type="number"
                    value={formData.acreage || ''}
                    onChange={(e) => setFormData({ ...formData, acreage: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    value={formData.size || ''}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ownership</label>
                  <input
                    type="text"
                    value={formData.ownership || ''}
                    onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stage</label>
                  <select value={formData.stage || 'feasibility'} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}>
                    <option value="feasibility">Feasibility</option>
                    <option value="entitlement">Entitlement</option>
                    <option value="construction">Construction</option>
                    <option value="stabilized">Stabilized</option>
                  </select>
                </div>
                <div className={styles.formButtons}>
                  <button type="button" className="primary" onClick={handleSave}>
                    Save
                  </button>
                  <button type="button" className="secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <label>Address</label>
                  <p>{project.address || 'Not specified'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Acreage</label>
                  <p>{project.acreage || 'Not specified'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Size</label>
                  <p>{project.size || 'Not specified'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Ownership</label>
                  <p>{project.ownership || 'Not specified'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Stage</label>
                  <p className={styles.stage}>{project.stage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className={styles.content}>
            <form onSubmit={handleCreateTask} className={styles.quickForm}>
              <input
                type="text"
                placeholder="New task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit" className="primary">Add Task</button>
            </form>

            {tasks && tasks.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td><span className={styles.badge}>{task.status}</span></td>
                      <td>{task.priority}</td>
                      <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No tasks yet</p>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className={styles.content}>
            <form onSubmit={handleCreateContact} className={styles.contactForm}>
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={newContact.role}
                onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
              />
              <input
                type="text"
                placeholder="Company"
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
              <button type="submit" className="primary">Add Contact</button>
            </form>

            {contacts && contacts.length > 0 ? (
              <div className={styles.contactsList}>
                {contacts.map((contact) => (
                  <div key={contact.id} className={styles.contactCard}>
                    <h4>{contact.name}</h4>
                    {contact.role && <p>{contact.role}</p>}
                    {contact.company && <p className="text-muted">{contact.company}</p>}
                    {contact.email && <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
                    {contact.phone && <p>{contact.phone}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No contacts yet</p>
            )}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className={styles.content}>
            <MeetingsPanel projectId={id || ''} />
          </div>
        )}
      </div>
    </>
  )
}
