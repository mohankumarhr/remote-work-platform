import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import '../Styles/Meetings.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTeamsByUser } from '../API/teamAPI'
import { fetchMeetingsByTeam, createMeeting } from '../API/meetingAPI'
import { getCurrentUserId } from '../data'

function Meetings() {
  const dispatch = useDispatch()
  const teams = useSelector((state) => state.getMemberedTeam.value) || []

  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', startTime: '', duration: 30, teamId: '' })

  useEffect(() => {
    // ensure teams loaded
    dispatch(fetchTeamsByUser())
  }, [dispatch])

  useEffect(() => {
    const load = async () => {
      if (!Array.isArray(teams) || teams.length === 0) {
        setMeetings([])
        return
      }
      setLoading(true)
      try {
        const results = await Promise.all(teams.map(async (t) => {
          try {
            const res = await fetchMeetingsByTeam(t.id)
            return Array.isArray(res) ? res : []
          } catch (e) {
            return []
          }
        }))
        const merged = results.flat().sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        setMeetings(merged)
      } catch (err) {
        console.error('Failed to load meetings', err)
        setMeetings([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [teams])

  const openForm = () => {
    setIsClosing(false)
    setForm({ title: '', description: '', startTime: '', duration: 30, teamId: teams[0]?.id || '' })
    setFormOpen(true)
  }

  const closeModal = () => {
    // play closing animation then unmount
    setIsClosing(true)
    window.setTimeout(() => {
      setFormOpen(false)
      setIsClosing(false)
    }, 260)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submitForm = async (e) => {
    e.preventDefault()
    try {
      const organizerId = getCurrentUserId() || null
      await createMeeting({
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        duration: Number(form.duration),
        teamId: form.teamId,
        organizerId
      })
      // refresh
      setFormOpen(false)
      // reload meetings for chosen team only
      const res = await fetchMeetingsByTeam(form.teamId)
      setMeetings(prev => {
        const filtered = prev.filter(m => m.teamId !== form.teamId)
        return [...filtered, ...(Array.isArray(res) ? res : [])].sort((a,b)=> new Date(a.startTime)-new Date(b.startTime))
      })
    } catch (err) {
      console.error('Failed to create meeting', err)
      alert('Failed to create meeting')
    }
  }

  return (
    <div className='dashboardLayout'>
      <Sidebar />
      <div className='mainContentArea'>
        <Navbar />
        <div className='dashboardContent meetingsPage'>
          <div className='meetingsHeader'>
            <h2>Team Meetings</h2>
            <div>
              <button className='btn-primary' onClick={openForm}>Schedule Meeting</button>
            </div>
          </div>

          {formOpen && createPortal(
            <div className={`modal-overlay ${isClosing ? 'closing' : 'open'}`} onMouseDown={() => closeModal()}>
              <div className={`modal-card ${isClosing ? 'closing' : 'open'}`} onMouseDown={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                  <h3>Schedule Meeting</h3>
                  <button className='modal-close' onClick={() => closeModal()}>×</button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={async (e) => { await submitForm(e); /* ensure modal closes with animation */ closeModal(); }}>
                    <div className='formRow'>
                      <label>Title</label>
                      <input name='title' value={form.title} onChange={handleChange} required />
                    </div>
                    <div className='formRow'>
                      <label>Description</label>
                      <textarea name='description' value={form.description} onChange={handleChange} />
                    </div>
                    <div className='formRow'>
                      <label>Start Time</label>
                      <input name='startTime' type='datetime-local' value={form.startTime} onChange={handleChange} required />
                    </div>
                    <div className='formRow'>
                      <label>Duration (minutes)</label>
                      <input name='duration' type='number' min='1' value={form.duration} onChange={handleChange} required />
                    </div>
                    <div className='formRow'>
                      <label>Team</label>
                      <select name='teamId' value={form.teamId} onChange={handleChange} required>
                        <option value=''>Select a team</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className='formActions'>
                      <button type='button' className='btn-secondary' onClick={() => closeModal()}>Cancel</button>
                      <button type='submit' className='btn-primary'>Create</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>,
            document.body
          )}

          <div className='meetingsListCard'>
            <h3>Upcoming Meetings</h3>
            {loading ? <div>Loading...</div> : (
              meetings.length === 0 ? <div>No meetings scheduled</div> : (
                <ul className='meetingsListFull'>
                  {meetings.map(m => (
                    <li className='meetingRow' key={m.id}>
                      <div className='meetingInfo'>
                        <div className='meetingTitle'>{m.title}</div>
                        <div className='meetingMeta'>Team: {m.teamName || m.teamId} • {new Date(m.startTime).toLocaleString()}</div>
                        <div className='meetingDesc'>{m.description}</div>
                      </div>
                      <div className='meetingActions'>
                        <div className='meetingDuration'>{m.duration} min</div>
                        <button className='btn-secondary'>Details</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meetings
