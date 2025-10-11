import React, { useEffect, useState } from 'react'
import '../Styles/CreateProjectModal.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTeamsByUser } from '../API/teamAPI'

function CreateProjectModal({ isOpen, onClose, onSubmit, isLoading = false, editData = null }) {
    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        projectSubject: '',
        detailedDescription: '',
        teamId: '',
        dueDate: ''
    })

    const dispatch = useDispatch();

    const [errors, setErrors] = useState({})

    const teamsData = useSelector((state) => state.getMemberedTeam.value)

    // Auto-fill form when editData is provided
    useEffect(() => {
        if (editData && isOpen) {
            setFormData({
                projectId: editData.id || editData.projectId || '',
                projectName: editData.name || editData.projectName || '',
                projectSubject: editData.subject || editData.projectSubject || '',
                detailedDescription: editData.description || editData.detailedDescription || '',
                teamId: editData.teamId || '',
                dueDate: editData.dueDate ? editData.dueDate.split('T')[0] : '' // Format date for input
            })
        } else if (!editData && isOpen) {
            // Reset form for new project creation
            setFormData({
                projectId: '',
                projectName: '',
                projectSubject: '',
                detailedDescription: '',
                teamId: '',
                dueDate: ''
            })
        }
    }, [editData, isOpen])

    useEffect(()=>{
                dispatch(fetchTeamsByUser())
    }, [dispatch])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.projectName.trim()) {
            newErrors.projectName = 'Project name is required'
        }
        
        if (!formData.projectSubject.trim()) {
            newErrors.projectSubject = 'Project subject is required'
        }
        
        if (!formData.detailedDescription.trim()) {
            newErrors.detailedDescription = 'Detailed description is required'
        }
        
        if (!formData.teamId) {
            newErrors.teamId = 'Please select a team'
        }
        
        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required'
        } else {
            const selectedDate = new Date(formData.dueDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0) // Reset time to compare dates only
            
            if (selectedDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past'
            }
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (validateForm()) {
            const selectedTeam = teamsData.find(team => team.id === parseInt(formData.teamId))
            
            const projectData = {
                ...formData,
                // teamName: selectedTeam?.name || '',
                // createdAt: new Date().toISOString(),
                // status: 'planning',
                // progress: 0
            }
            
            onSubmit(projectData)
            
            // Reset form
            setFormData({
                projectName: '',
                projectSubject: '',
                detailedDescription: '',
                teamId: '',
                dueDate: ''
            })
            setErrors({})
        }
    }

    const handleClose = () => {
        setFormData({
            projectName: '',
            projectSubject: '',
            detailedDescription: '',
            teamId: '',
            dueDate: ''
        })
        setErrors({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="createProjectModal" onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <h3>{editData ? 'Edit Project' : 'Create New Project'}</h3>
                    <button className="closeButton" onClick={handleClose}>×</button>
                </div>

                <form className="createProjectForm" onSubmit={handleSubmit}>
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="projectName">Project Name</label>
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                className={`${errors.projectName ? 'error' : ''}`}
                                placeholder="Enter project name"
                                required
                            />
                            {errors.projectName && <span className="errorText">{errors.projectName}</span>}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="teamId">Assign to Team</label>
                            <select
                                id="teamId"
                                name="teamId"
                                value={formData.teamId}
                                onChange={handleInputChange}
                                className={`${errors.teamId ? 'error' : ''}`}
                                required
                            >
                                <option value="">Select a team</option>
                                {teamsData.map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teamId && <span className="errorText">{errors.teamId}</span>}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className={`${errors.dueDate ? 'error' : ''}`}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            {errors.dueDate && <span className="errorText">{errors.dueDate}</span>}
                        </div>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="projectSubject">Project Subject</label>
                        <input
                            type="text"
                            id="projectSubject"
                            name="projectSubject"
                            value={formData.projectSubject}
                            onChange={handleInputChange}
                            className={`${errors.projectSubject ? 'error' : ''}`}
                            placeholder="Brief subject or tagline for the project"
                            required
                        />
                        {errors.projectSubject && <span className="errorText">{errors.projectSubject}</span>}
                    </div>

                    <div className="formGroup">
                        <label htmlFor="detailedDescription">Detailed Description</label>
                        <textarea
                            id="detailedDescription"
                            name="detailedDescription"
                            value={formData.detailedDescription}
                            onChange={handleInputChange}
                            className={`${errors.detailedDescription ? 'error' : ''}`}
                            placeholder="Provide a detailed description of the project, including goals, scope, and expected outcomes..."
                            rows="4"
                            required
                        />
                        {errors.detailedDescription && <span className="errorText">{errors.detailedDescription}</span>}
                    </div>

                    <div className="formActions">
                        <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="createButton"
                            disabled={isLoading}
                        >
                            {isLoading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Project' : 'Create Project')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProjectModal
