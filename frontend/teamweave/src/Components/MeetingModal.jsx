 import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import { fetchTeamsByUser, fetchTeamMember } from '../API/teamAPI'
import '../Styles/MeetingModal.css'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserId } from '../data'

export default function MeetingModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return

    let mounted = true
    const load = async () => {
      try {
        const teamsRes = await dispatch(fetchTeamsByUser()).unwrap()
        const teams = teamsRes || []
        const allMembers = {}

        for (const t of teams) {
          try {
            const membersRes = await dispatch(fetchTeamMember(t.id)).unwrap()
            for (const m of membersRes) {
              allMembers[m.id] = m
            }
          } catch (e) {
            // ignore per-team errors
          }
        }

        if (mounted) setMembers(Object.values(allMembers))
      } catch (err) {
        console.error('Failed to load teams/members', err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [isOpen, dispatch])

  const addMember = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev)
      copy.add(id)
      return copy
    })
  }

  const removeMember = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev)
      copy.delete(id)
      return copy
    })
  }

  const startCall = () => {
    const targets = Array.from(selected)
    if (targets.length === 0) return
    // navigate to call page with targets as query param
    navigate(`/call/${targets.join(',')}`)
    onClose && onClose()
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="meeting-modal-overlay">
      <div className="meeting-modal-card">
        <div className="modal-header">
          <h3>Select Members to Call</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {members.length === 0 ? (
            <div className="empty">No members found</div>
          ) : (
            <div className="member-multiselect">
              <div className="member-search">
                <input
                  type="text"
                  placeholder="Search members by name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="selected-chips">
                {Array.from(selected).map((id) => {
                  const m = members.find((x) => x.id === id)
                  if (!m) return null
                  return (
                    <span key={id} className="chip">
                      {m.fullName || m.userName || m.email}
                      <button className="chip-remove" onClick={() => removeMember(id)}>×</button>
                    </span>
                  )
                })}
              </div>

              <ul className="member-list">
                {members
                  .filter((m) => {
                    if (!query) return true
                    const q = query.toLowerCase()
                    return (m.fullName || m.userName || m.email || '').toLowerCase().includes(q)
                  })
                  .filter((m) => m.id != getCurrentUserId())
                  .map((m) => (
                    <li key={m.id} className="member-item">
                      <div className="member-row">
                        <div className="member-info">
                          <div className="member-name">{m.fullName || m.userName || m.email}</div>
                          <div className="member-role">{m.role || ''}</div>
                        </div>
                        <div className="member-action">
                          <button
                            className="btn-add"
                            disabled={selected.has(m.id)}
                            onClick={() => addMember(m.id)}
                          >
                            {selected.has(m.id) ? 'Added' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={startCall} disabled={selected.size===0}>Start Call</button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document?.body || document.createElement('div'))
}
