import React, { useState, useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import '../Styles/CreateTeamModal.css'

function CreateTeamModal({ isOpen, onClose, onSubmit, isLoading = false, editData = null }) {
    const [newTeam, setNewTeam] = useState({
        teamId: '',
        name: '',
        description: ''
    })

    // Auto-fill form when editData is provided
    useEffect(() => {
        if (editData && isOpen) {
            setNewTeam({
                teamId: editData.id || editData.teamId || '',
                name: editData.name || '',
                description: editData.description || ''
            })
        } else if (!editData && isOpen) {
            // Reset form for new team creation
            setNewTeam({
                teamId: '',
                name: '',
                description: ''
            })
        }
    }, [editData, isOpen])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewTeam(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateSubmit = (e) => {
        e.preventDefault()
        // Call the onSubmit prop with team data (including teamId for edit)
        onSubmit(newTeam)
        // Reset form
        setNewTeam({ teamId: '', name: '', description: '' })
        onClose()
    }

    const handleClose = () => {
        setNewTeam({ teamId: '', name: '', description: '' })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className='modalOverlay' onClick={handleClose}>
            <div className='createTeamModal' onClick={(e) => e.stopPropagation()}>
                <div className='modalHeader'>
                    <h3>{editData ? 'Edit Team' : 'Create New Team'}</h3>
                    <button className='closeButton' onClick={handleClose}>×</button>
                </div>
                <form className='createTeamForm' onSubmit={handleCreateSubmit}>
                    <div className='formGroup'>
                        <label htmlFor='teamName'>Team Name</label>
                        <input
                            type='text'
                            id='teamName'
                            name='name'
                            value={newTeam.name}
                            onChange={handleInputChange}
                            placeholder='Enter team name'
                            required
                        />
                    </div>
                    <div className='formGroup'>
                        <label htmlFor='teamDescription'>Description</label>
                        <textarea
                            id='teamDescription'
                            name='description'
                            value={newTeam.description}
                            onChange={handleInputChange}
                            placeholder='Describe what this team does...'
                            rows='4'
                            required
                        />
                    </div>
                    <div className='formActions'>
                        <button type='button' className='cancelButton' onClick={handleClose}>
                            Cancel
                        </button>
                        <button 
                            type='submit' 
                            className='createButton'
                            disabled={isLoading}
                        >
                            {isLoading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Team' : 'Create Team')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTeamModal
