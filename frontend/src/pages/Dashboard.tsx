import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { useProjects, useCreateProject } from '@/hooks/useProjects'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [filter, setFilter] = useState<string>('')
  const { data: projects, isLoading, error } = useProjects({ stage: filter || undefined })
  const createProject = useCreateProject()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    stage: 'feasibility',
  })

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject.mutateAsync(formData)
      setFormData({ name: '', address: '', stage: 'feasibility' })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const stages = ['feasibility', 'entitlement', 'construction', 'stabilized']

  return (
    <>
      <Navigation />
      <div className={`container p-2 ${styles.dashboard}`}>
        <div className={styles.header}>
          <h1>Projects</h1>
          <button className="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateProject} className={styles.form}>
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div className="form-group">
              <label>Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className="primary">
                Create Project
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.filters}>
          <label>Filter by Stage:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p className="text-muted">Loading projects...</p>}
        {error && <p className="text-danger">Error loading projects</p>}

        <div className={styles.grid}>
          {projects?.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`} className={styles.card}>
              <h3>{project.name}</h3>
              <p className="text-muted">{project.address || 'No address'}</p>
              <div className={styles.meta}>
                <span className={styles.stage}>{project.stage}</span>
              </div>
            </Link>
          ))}
        </div>

        {projects?.length === 0 && (
          <div className={styles.empty}>
            <p>No projects yet. Create your first project to get started!</p>
          </div>
        )}
      </div>
    </>
  )
}
