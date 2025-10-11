import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import {membersData, projectsDetailedData } from '../data'
import '../Styles/CreateTaskModal.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTeamMember, fetchTeamsByUser } from '../API/teamAPI'
import { fetchProjectByTeam } from '../API/ProjectAPI'
import { createTask, updateTask } from '../API/taskAPI'
import Cookies from 'js-cookie'

function CreateTaskModal({ isOpen, onClose, onSubmit, editData = null }) {
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        teamId: '',
        projectId: '',
        priority: 'medium',
        dueDate: '',
        assignedUserId: ''
    })

    const dispatch = useDispatch();

    const teamsData = useSelector((state) => state.getMemberedTeam.value)
    const filteredUsers = useSelector((state) => state.getTeamMembers.value)
    const filteredProjects = useSelector((state) => state.getProject.value)
    const isLoading = useSelector((state) => state.getAssignedTask.loading)
    
    // Auto-fill form when editData is provided
    useEffect(() => {
        if (editData && isOpen) {
            setNewTask({
                title: editData.title || '',
                description: editData.description || '',
                teamId: editData.teamId ? String(editData.teamId) : '',
                projectId: editData.projectId ? String(editData.projectId) : '',
                priority: editData.priority ? editData.priority.toLowerCase() : 'medium',
                dueDate: editData.dueDate ? editData.dueDate.split('T')[0] : '', // Format date for input
                assignedUserId: editData.assignedToUserId ? String(editData.assignedToUserId) : (editData.assignedUserId ? String(editData.assignedUserId) : '')
            })
        } else if (!editData && isOpen) {
            // Reset form for new task creation
            setNewTask({
                title: '',
                description: '',
                teamId: '',
                projectId: '',
                priority: 'medium',
                dueDate: '',
                assignedUserId: ''
            })
        }
    }, [editData, isOpen])
    
    useEffect(()=>{
        dispatch(fetchTeamsByUser())
    }, [dispatch])

    useEffect(()=>{
        dispatch(fetchProjectByTeam(newTask.teamId))
        dispatch(fetchTeamMember(newTask.teamId))
    }, [dispatch, newTask.teamId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewTask(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateSubmit = async (e) => {
        e.preventDefault()
        
        try {
            // Get current user ID from JWT token
            const token = Cookies.get("jwtToken")
            let createdByUserId = null
            
            if (token) {
                // Decode JWT token to get user ID
                const payload = JSON.parse(atob(token.split('.')[1]))
                createdByUserId = payload.userId || payload.id || payload.sub
            }
            
            if (!createdByUserId) {
                console.error('Unable to get user ID from token')
                return
            }
            
            // Prepare task data according to the specified structure
            if(editData){
                const neweditdata = {
                title: newTask.title,
                description: newTask.description,
                dueDate: newTask.dueDate,
                priority: newTask.priority.toUpperCase(), // Convert to uppercase (LOW, MEDIUM, HIGH)
                status: editData.status || "TODO", // Keep existing status or default to TODO
                assignedToUserId: parseInt(newTask.assignedUserId),
                createdByUserId: createdByUserId,
                teamId: parseInt(newTask.teamId),
                projectId: parseInt(newTask.projectId)
                }
                console.log('Task updated successfully:', neweditdata)
                
                const result = await dispatch(updateTask({taskId: editData.id, taskData: neweditdata})).unwrap()
                
                console.log('Task updated successfully:', result)
                console.log('Task updated successfully:', neweditdata)

            }else{
                const taskData = {
                title: newTask.title,
                description: newTask.description,
                dueDate: newTask.dueDate,
                priority: newTask.priority.toUpperCase(), // Convert to uppercase (LOW, MEDIUM, HIGH)
                status: "TODO", // Default status as requested
                assignedToUserId: parseInt(newTask.assignedUserId),
                createdByUserId: createdByUserId,
                teamId: parseInt(newTask.teamId),
                projectId: parseInt(newTask.projectId)
            }
            
            // Dispatch the createTask action
            const result = await dispatch(createTask(taskData)).unwrap()
            
            console.log('Task created successfully:', result)
            console.log('Task created successfully:', taskData)
            }
            
            // Reset form on success
            setNewTask({
                title: '',
                description: '',
                teamId: '',
                projectId: '',
                priority: 'medium',
                dueDate: '',
                assignedUserId: ''
            })
            
            // Close modal
            onClose()
            
        } catch (error) {
            console.error('Failed to create task:', error)
            // You could show an error notification here
        }
    }

    const handleClose = () => {
        setNewTask({
            title: '',
            description: '',
            teamId: '',
            projectId: '',
            priority: 'medium',
            dueDate: '',
            assignedUserId: ''
        })
        onClose()
    }

    // Filter projects based on selected team
    // const filteredProjects = newTask.teamId 
    //     ? projectsDetailedData.filter(project => {
    //         const selectedTeam = teamsData.find(team => team.id === parseInt(newTask.teamId))
    //         return selectedTeam?.projects.includes(project.id)
    //     })
    //     : projectsDetailedData

    // Filter users based on selected team
    // const filteredUsers = newTask.teamId 
    //     ? membersData.filter(member => {
    //         const selectedTeam = teamsData.find(team => team.id === parseInt(newTask.teamId))
    //         return selectedTeam?.memberIds.includes(member.id)
    //     })
    //     : membersData

    if (!isOpen) return null

    return (
        <div className='modalOverlay' onClick={handleClose}>
            <div className='createTaskModal' onClick={(e) => e.stopPropagation()}>
                <div className='modalHeader'>
                    <h3>{editData ? 'Edit Task' : 'Create New Task'}</h3>
                    <button className='closeButton' onClick={handleClose}>×</button>
                </div>
                <form className='createTaskForm' onSubmit={handleCreateSubmit}>
                    <div className='formRow'>
                        <div className='formGroup'>
                            <label htmlFor='taskTitle'>Task Title</label>
                            <input
                                type='text'
                                id='taskTitle'
                                name='title'
                                value={newTask.title}
                                onChange={handleInputChange}
                                placeholder='Enter task title'
                                required
                            />
                        </div>
                        <div className='formGroup'>
                            <label htmlFor='taskPriority'>Priority</label>
                            <select
                                id='taskPriority'
                                name='priority'
                                value={newTask.priority}
                                onChange={handleInputChange}
                                required
                            >
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>
                        </div>
                    </div>

                    <div className='formGroup'>
                        <label htmlFor='taskDescription'>Description</label>
                        <textarea
                            id='taskDescription'
                            name='description'
                            value={newTask.description}
                            onChange={handleInputChange}
                            placeholder='Describe the task...'
                            rows='3'
                            required
                        />
                    </div>

                    <div className='formRow'>
                        <div className='formGroup'>
                            <label htmlFor='taskTeam'>Team</label>
                            <select
                                id='taskTeam'
                                name='teamId'
                                value={newTask.teamId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value=''>Select a team</option>
                                {teamsData.map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='formGroup'>
                            <label htmlFor='taskProject'>Project</label>
                            <select
                                id='taskProject'
                                name='projectId'
                                value={newTask.projectId}
                                onChange={handleInputChange}
                                required
                                disabled={!newTask.teamId}
                            >
                                <option value=''>Select a project</option>
                                {filteredProjects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='formGroup'>
                            <label htmlFor='taskAssignee'>Assign to User</label>
                            <select
                                id='taskAssignee'
                                name='assignedUserId'
                                value={newTask.assignedUserId}
                                onChange={handleInputChange}
                                required
                                disabled={!newTask.teamId}
                            >
                                <option value=''>Select a user</option>
                                {filteredUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName || user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='formGroup'>
                        <label htmlFor='taskDueDate'>Due Date</label>
                        <input
                            type='date'
                            id='taskDueDate'
                            name='dueDate'
                            value={newTask.dueDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
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
                            {isLoading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTaskModal
