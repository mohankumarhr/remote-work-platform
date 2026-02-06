import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import CreateTaskModal from '../Components/CreateTaskModal'
import '../Styles/Dashboard.css' // For layout styles
import '../Styles/Tasks.css'     // For Tasks-specific styles
import { FiPlus, FiCalendar, FiUser, FiFlag, FiCheck, FiClock, FiFilter, FiSearch, FiX } from 'react-icons/fi'
import { teamsData, projectsDetailedData } from '../data'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssignedTasks, updateTaskStatus } from '../API/taskAPI'
import { fetchTeamsByUser } from '../API/teamAPI'

function Tasks() {

    const dispatch = useDispatch();

    const [isCollapsed, setIsSidebarCollapsed] = useState(() => {
        // Initialize as collapsed on mobile
        return window.innerWidth <= 768
    })
    const [showCreateTask, setShowCreateTask] = useState(false)
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPriority, setFilterPriority] = useState('all')
    const [filterTeam, setFilterTeam] = useState('all')
    const [filterProject, setFilterProject] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const tasks = useSelector((state) => state.getAssignedTask.value)
    const teamsData = useSelector((state) => state.getMemberedTeam.value)
    const isLoading = useSelector((state) => state.getAssignedTask.loading)
    const error = useSelector((state) => state.getAssignedTask.error)

     const seen = new Set();


    useEffect(() => {
        dispatch(fetchAssignedTasks())
        dispatch(fetchTeamsByUser())
        // console.log(apiTask)
    }, [dispatch])


    // const [tasks, setTasks] = useState([
    //     {
    //         id: 1,
    //         title: "Design homepage mockups",
    //         description: "Create high-fidelity mockups for the new homepage design",
    //         status: "inprogress",
    //         priority: "high",
    //         dueDate: "2025-08-10",
    //         teamName: "Design Team",
    //         projectName: "Website Redesign",
    //         assignee: "You",
    //         createdAt: "2025-08-01"
    //     },
    //     {
    //         id: 2,
    //         title: "Implement user authentication",
    //         description: "Set up OAuth 2.0 authentication system",
    //         status: "todo",
    //         priority: "high",
    //         dueDate: "2025-08-15",
    //         teamName: "Development Team",
    //         projectName: "API Integration Platform",
    //         assignee: "You",
    //         createdAt: "2025-08-02"
    //     },
    //     {
    //         id: 3,
    //         title: "Write API documentation",
    //         description: "Document all API endpoints with examples",
    //         status: "completed",
    //         priority: "medium",
    //         dueDate: "2025-08-05",
    //         teamName: "Development Team",
    //         projectName: "API Integration Platform",
    //         assignee: "You",
    //         createdAt: "2025-07-28"
    //     },
    //     {
    //         id: 4,
    //         title: "Create social media content",
    //         description: "Design graphics and write copy for social media campaign",
    //         status: "todo",
    //         priority: "low",
    //         dueDate: "2025-08-20",
    //         teamName: "Marketing Team",
    //         projectName: "Marketing Campaign Launch",
    //         assignee: "You",
    //         createdAt: "2025-08-03"
    //     },
    //     {
    //         id: 5,
    //         title: "Optimize database queries",
    //         description: "Improve performance of slow database queries",
    //         status: "blocked",
    //         priority: "high",
    //         dueDate: "2025-08-12",
    //         teamName: "Development Team",
    //         projectName: "Performance Optimization",
    //         assignee: "You",
    //         createdAt: "2025-07-30"
    //     }
    // ])

    const handleCreateTask = () => {
        setShowCreateTask(true)
        console.log(tasks)
    }

    const closeCreateTask = () => {
        setShowCreateTask(false)
    }

    const handleTaskSubmit = (taskData) => {
        console.log("New Task Data ", taskData)
        closeCreateTask()
        // You could add success notification here
    }

    const handleStatusChange = (taskId, newStatus) => {
        // Dispatch action to update task status
        dispatch(updateTaskStatus({ taskId, status: newStatus }))
            .unwrap()
            .then(() => {
                console.log(`Task ${taskId} status updated to ${newStatus}`)
                dispatch(fetchAssignedTasks())
            })
            .catch((error) => {
                console.error('Failed to update task status:', error)
                // You could show a toast notification here
            })

    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'completed'
            case 'IN_PROGRESS': return 'inprogress'
            case 'TODO': return 'todo'
            case 'ON_HOLD': return 'onhold'
            default: return 'todo'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'high'
            case 'medium': return 'medium'
            case 'low': return 'low'
            default: return 'medium'
        }
    }

    const filteredTasks = tasks.filter(task => {
        const statusMatch = filterStatus === 'all' || task.status === filterStatus
        const priorityMatch = filterPriority === 'all' || task.priority === filterPriority
        const teamMatch = filterTeam === 'all' || task.teamName === filterTeam
        const projectMatch = filterProject === 'all' || task.projectName === filterProject
        const searchMatch = searchTerm === '' ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())

        return statusMatch && priorityMatch && teamMatch && projectMatch && searchMatch
    })

    const getTaskCounts = () => {
        return {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'TODO').length,
            inprogress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
            completed: tasks.filter(t => t.status === 'COMPLETED').length,
            blocked: tasks.filter(t => t.status === 'ON_HOLD').length
        }
    }

    const taskCounts = getTaskCounts()

    const clearAllFilters = () => {
        setFilterStatus('all')
        setFilterPriority('all')
        setFilterTeam('all')
        setFilterProject('all')
        setSearchTerm('')
    }

    const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' ||
        filterTeam !== 'all' || filterProject !== 'all' || searchTerm !== ''


    function formatStatus(status) {
        if (!status) return status;

        return status
            .toLowerCase()              // "in_progress" → "in progress"
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
    }

    return (
        <div className='dashboardLayout'>
            <Sidebar isCollapsed={isCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
            <Navbar setIsSidebarCollapsed={setIsSidebarCollapsed} isCollapsed={isCollapsed} />

            <div className={`mainContentArea ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='tasksContent'>
                    {/* Header */}
                    <div className='tasksHeader'>
                        <div className='headerInfo'>
                            <h1 className='pageTitle'>My Tasks</h1>
                            <p className='pageSubtitle'>Manage and track your assigned tasks</p>
                        </div>
                        <button className='createTaskBtn' onClick={handleCreateTask}>
                            <FiPlus />
                            <span>Create Task</span>
                        </button>
                    </div>

                    {/* Task Stats */}
                    <div className='taskStats'>
                        <div className='statCard'>
                            <div className='statInfo'>
                                <span className='statValue'>{taskCounts.total}</span>
                                <span className='statLabel'>Total Tasks</span>
                            </div>
                        </div>
                        <div className='statCard'>
                            <div className='statInfo'>
                                <span className='statValue'>{taskCounts.todo}</span>
                                <span className='statLabel'>To Do</span>
                            </div>
                        </div>
                        <div className='statCard'>
                            <div className='statInfo'>
                                <span className='statValue'>{taskCounts.inprogress}</span>
                                <span className='statLabel'>In Progress</span>
                            </div>
                        </div>
                        <div className='statCard'>
                            <div className='statInfo'>
                                <span className='statValue'>{taskCounts.completed}</span>
                                <span className='statLabel'>Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className='taskControls'>
                        <div className='searchContainer'>
                            <FiSearch className='searchIcon' />
                            <input
                                type='text'
                                placeholder='Search tasks...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='searchInput'
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className='clearSearch'
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>

                        <div className='filterControls'>
                            <button
                                className={`filterToggle ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FiFilter />
                                <span>Filters</span>
                                {hasActiveFilters && <div className='filterIndicator'></div>}
                            </button>

                            {hasActiveFilters && (
                                <button className='clearFilters' onClick={clearAllFilters}>
                                    <FiX />
                                    <span>Clear All</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className='filtersPanel'>
                            <div className='filterRow'>
                                <div className='filterGroup'>
                                    <label>Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className='filterSelect'
                                    >
                                        <option value='all'>All Status</option>
                                        <option value='TODO'>To Do</option>
                                        <option value='IN_PROGRESS'>In Progress</option>
                                        <option value='COMPLETED'>Completed</option>
                                        <option value='ON_HOLD'>On Hold</option>
                                    </select>
                                </div>

                                <div className='filterGroup'>
                                    <label>Priority</label>
                                    <select
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                        className='filterSelect'
                                    >
                                        <option value='all'>All Priority</option>
                                        <option value='HIGH'>High Priority</option>
                                        <option value='MEDIUM'>Medium Priority</option>
                                        <option value='LOW'>Low Priority</option>
                                    </select>
                                </div>

                                <div className='filterGroup'>
                                    <label>Team</label>
                                    <select
                                        value={filterTeam}
                                        onChange={(e) => setFilterTeam(e.target.value)}
                                        className='filterSelect'
                                    >
                                        <option value='all'>All Teams</option>
                                        {teamsData.map(team => (
                                            <option key={team.id} value={team.name}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='filterGroup'>
                                    <label>Project</label>
                                    <select
                                        value={filterProject}
                                        onChange={(e) => setFilterProject(e.target.value)}
                                        className='filterSelect'
                                    >
                                        <option value='all'>All Projects</option>
                                        {tasks.map(project => {
                                            if (seen.has(project.projectName)) {
                                                return null;  // Skip if project name already seen
                                            }
                                            seen.add(project.projectName);
                                            return (
                                                <option key={project.projectId} value={project.projectName}>
                                                    {project.projectName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className='errorMessage' style={{
                            backgroundColor: '#fee',
                            color: '#c53030',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid #feb2b2'
                        }}>
                            Error: {error}
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className='loadingIndicator' style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#666'
                        }}>
                            Loading task...
                        </div>
                    )}

                    {/* Tasks List */}
                    <div className='tasksList'>
                        {filteredTasks.map(task => (
                            <div key={task.id} className='taskCard'>
                                <div className='taskHeader'>
                                    <div className='taskTitle'>
                                        <div className='titleRow'>
                                            <h3>{task.title}</h3>
                                            <div className='taskMeta'>
                                                <span className={`taskPriority ${getPriorityColor(task.priority)}`}>
                                                    {task.priority} priority
                                                </span>
                                                <span className='taskProject'>{task.projectName}</span>
                                                <span className='taskTeam'>{task.teamName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='taskActions'>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className={`statusSelect ${getStatusColor(task.status)}`}
                                            disabled={isLoading}
                                        >
                                            <option value='TODO'>To Do</option>
                                            <option value='IN_PROGRESS'>In Progress</option>
                                            <option value='COMPLETED'>Completed</option>
                                            <option value='ON_HOLD'>On Hold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='taskBody'>
                                    <p className='taskDescription'>{task.description}</p>
                                </div>

                                <div className='taskFooter'>
                                    <div className='taskInfo'>
                                        <span className='taskDue'>
                                            <FiCalendar />
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className='taskAssignee'>
                                            <FiUser />
                                            {task.assignee}
                                        </span>
                                    </div>
                                    <span className={`taskStatus ${getStatusColor(task.status)}`}>
                                        {formatStatus(task.status)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {filteredTasks.length === 0 && (
                            <div className='emptyState'>
                                <FiFlag className='emptyIcon' />
                                <h3>No tasks found</h3>
                                <p>No tasks match your current filters. Try adjusting your filters or create a new task.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={showCreateTask}
                onClose={closeCreateTask}
                onSubmit={handleTaskSubmit}
            />
        </div>
    )
}

export default Tasks
