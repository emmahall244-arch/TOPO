import { useState } from 'react'
import { useMeetings, useCreateMeeting, useCleanupMeeting, useDeleteMeeting } from '@/hooks/useMeetings'
import styles from './MeetingsPanel.module.css'

interface MeetingsPanelProps {
  projectId: string
}

export default function MeetingsPanel({ projectId }: MeetingsPanelProps) {
  const { data: meetings } = useMeetings(projectId)
  const createMeeting = useCreateMeeting()
  const cleanupMeeting = useCleanupMeeting()
  const deleteMeeting = useDeleteMeeting()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    attendees: '',
    notes: '',
  })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMeeting.mutateAsync({
        projectId,
        data: {
          ...formData,
          date: new Date(formData.date).toISOString(),
        },
      })
      setFormData({
        date: new Date().toISOString().split('T')[0],
        attendees: '',
        notes: '',
      })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create meeting:', error)
    }
  }

  const handleCleanup = async (id: string) => {
    try {
      await cleanupMeeting.mutateAsync(id)
    } catch (error) {
      console.error('Failed to cleanup meeting:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this meeting note?')) {
      try {
        await deleteMeeting.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete meeting:', error)
      }
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Meeting Notes</h3>
        <button className="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕' : '+ New Note'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateMeeting} className={styles.form}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Attendees</label>
            <input
              type="text"
              placeholder="John Doe, Jane Smith..."
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Enter your meeting notes here..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className={styles.formButtons}>
            <button type="submit" className="primary">Save Note</button>
            <button type="button" className="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {meetings && meetings.length > 0 ? (
        <div className={styles.list}>
          {meetings.map((meeting) => (
            <div key={meeting.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <button
                  className={styles.itemTitle}
                  onClick={() => setExpandedId(expandedId === meeting.id ? null : meeting.id)}
                >
                  <strong>{new Date(meeting.date).toLocaleDateString()}</strong>
                  {meeting.attendees && <span className={styles.attendees}>{meeting.attendees}</span>}
                </button>
                <div className={styles.actions}>
                  <button
                    className="secondary"
                    onClick={() => handleCleanup(meeting.id)}
                    title="Extract highlights"
                  >
                    🧹
                  </button>
                  <button
                    className="secondary"
                    onClick={() => handleDelete(meeting.id)}
                    title="Delete"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    🗑
                  </button>
                </div>
              </div>

              {expandedId === meeting.id && (
                <div className={styles.itemContent}>
                  <div className={styles.notesSection}>
                    <h4>Notes</h4>
                    <p className={styles.notes}>{meeting.notes}</p>
                  </div>
                  {meeting.highlights && (
                    <div className={styles.highlightsSection}>
                      <h4>Highlights</h4>
                      <p className={styles.highlights}>{meeting.highlights}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No meeting notes yet</p>
      )}
    </div>
  )
}
