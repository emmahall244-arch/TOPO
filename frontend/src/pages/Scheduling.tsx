import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { useSchedule, useCreatePhase, useCreateMilestone, useUpdateMilestone } from '@/hooks/useSchedule'
import { useProject } from '@/hooks/useProjects'
import styles from './Scheduling.module.css'

export default function Scheduling() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = useProject(id || '')
  const { data: schedule } = useSchedule(id || '')
  const createPhase = useCreatePhase()
  const createMilestone = useCreateMilestone()
  const updateMilestone = useUpdateMilestone()

  const [newPhase, setNewPhase] = useState({ name: '', startDate: '', endDate: '' })
  const [newMilestone, setNewMilestone] = useState({ name: '', dueDate: '', phaseId: '' })
  const [changeReason, setChangeReason] = useState<{ milestoneId: string; reason: string } | null>(null)

  const handleCreatePhase = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPhase.mutateAsync({
        projectId: id || '',
        data: {
          name: newPhase.name,
          startDate: newPhase.startDate || undefined,
          endDate: newPhase.endDate || undefined,
        },
      })
      setNewPhase({ name: '', startDate: '', endDate: '' })
    } catch (error) {
      console.error('Failed to create phase:', error)
    }
  }

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestone.phaseId) return
    try {
      await createMilestone.mutateAsync({
        phaseId: newMilestone.phaseId,
        data: {
          name: newMilestone.name,
          dueDate: newMilestone.dueDate || undefined,
        },
      })
      setNewMilestone({ name: '', dueDate: '', phaseId: '' })
    } catch (error) {
      console.error('Failed to create milestone:', error)
    }
  }

  const handleMilestoneStatusChange = async (milestoneId: string, _newStatus: string) => {
    setChangeReason({ milestoneId, reason: '' })
  }

  const handleConfirmChange = async (milestoneId: string) => {
    if (!changeReason?.reason) {
      alert('Please provide a reason for the change')
      return
    }
    try {
      await updateMilestone.mutateAsync({
        id: milestoneId,
        data: {},
        reason: changeReason.reason,
      })
      setChangeReason(null)
    } catch (error) {
      console.error('Failed to update milestone:', error)
    }
  }

  if (!project) return <div>Project not found</div>

  return (
    <>
      <Navigation />
      <div className={`container p-2 ${styles.scheduling}`}>
        <div className={styles.header}>
          <div>
            <Link to={`/project/${id}`} className={styles.backLink}>← Back to Project</Link>
            <h1>{project.name} - Scheduling</h1>
          </div>
          <button className="primary">📅 Export Calendar</button>
        </div>

        <div className={styles.sections}>
          {/* Create Phase Section */}
          <section className={styles.section}>
            <h2>Add Phase</h2>
            <form onSubmit={handleCreatePhase} className={styles.form}>
              <input
                type="text"
                placeholder="Phase name"
                value={newPhase.name}
                onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                required
              />
              <input
                type="date"
                value={newPhase.startDate}
                onChange={(e) => setNewPhase({ ...newPhase, startDate: e.target.value })}
              />
              <input
                type="date"
                value={newPhase.endDate}
                onChange={(e) => setNewPhase({ ...newPhase, endDate: e.target.value })}
              />
              <button type="submit" className="primary">Add Phase</button>
            </form>
          </section>

          {/* Schedule Timeline */}
          <section className={styles.section}>
            <h2>Project Schedule</h2>
            {schedule && schedule.length > 0 ? (
              <div className={styles.phases}>
                {schedule.map((phase) => (
                  <div key={phase.id} className={styles.phase}>
                    <div className={styles.phaseHeader}>
                      <h3>{phase.name}</h3>
                      {phase.startDate && (
                        <span className={styles.date}>
                          {new Date(phase.startDate).toLocaleDateString()} - {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'TBD'}
                        </span>
                      )}
                    </div>

                    <div className={styles.milestones}>
                      {phase.milestones && phase.milestones.length > 0 ? (
                        phase.milestones.map((milestone) => (
                          <div key={milestone.id} className={styles.milestone}>
                            <div className={styles.milestoneInfo}>
                              <input
                                type="checkbox"
                                defaultChecked={milestone.status === 'completed'}
                                onChange={(e) =>
                                  handleMilestoneStatusChange(
                                    milestone.id,
                                    e.target.checked ? 'completed' : 'pending'
                                  )
                                }
                              />
                              <div>
                                <p className={styles.milestoneName}>{milestone.name}</p>
                                {milestone.dueDate && (
                                  <p className={styles.milestoneDate}>
                                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={styles.status}>{milestone.status}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No milestones in this phase</p>
                      )}

                      {/* Add Milestone Form */}
                      {newMilestone.phaseId === phase.id ? (
                        <form onSubmit={handleCreateMilestone} className={styles.addMilestoneForm}>
                          <input
                            type="text"
                            placeholder="Milestone name"
                            value={newMilestone.name}
                            onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                            required
                          />
                          <input
                            type="date"
                            value={newMilestone.dueDate}
                            onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                          />
                          <button type="submit" className="primary">Add</button>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => setNewMilestone({ name: '', dueDate: '', phaseId: '' })}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          className="secondary"
                          onClick={() => setNewMilestone({ name: '', dueDate: '', phaseId: phase.id })}
                          style={{ marginTop: '12px', width: '100%' }}
                        >
                          + Add Milestone
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No phases yet. Create one above to get started.</p>
            )}
          </section>

          {/* Change Reason Modal */}
          {changeReason && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h3>Why are you making this change?</h3>
                <textarea
                  placeholder="Please explain the reason for this change..."
                  value={changeReason.reason}
                  onChange={(e) => setChangeReason({ ...changeReason, reason: e.target.value })}
                  rows={4}
                />
                <div className={styles.modalButtons}>
                  <button
                    className="primary"
                    onClick={() => handleConfirmChange(changeReason.milestoneId)}
                  >
                    Confirm
                  </button>
                  <button className="secondary" onClick={() => setChangeReason(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
