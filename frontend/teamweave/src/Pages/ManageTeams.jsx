import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import '../Styles/Dashboard.css'
import '../Styles/ManageTeams.css'
import { FiEdit, FiTrash2, FiPlus, FiUsers, FiFolder, FiCheckSquare, FiSearch, FiFilter } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCreatedTeams, deleteTeam, updateTeam, fetchTeamMember } from '../API/teamAPI'
import { addMemberToTeam, removeMemberFromTeam } from '../API/addMemberAPI'
import { fetchCreatedProjects, deleteProject, updateProject } from '../API/ProjectAPI'
import { fetchCreatedTasks, deleteTask } from '../API/taskAPI'
import CreateTeamModal from '../Components/CreateTeamModal'
import CreateProjectModal from '../Components/CreateProjectModal'
import CreateTaskModal from '../Components/CreateTaskModal'
import Cookies from 'js-cookie'
import { getInitials, stringToColor, getCurrentUserId } from '../data'

function ManageTeams() {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [addMemberTeamId, setAddMemberTeamId] = useState(null);
    const [addMemberUsername, setAddMemberUsername] = useState("");
    const [addMemberError, setAddMemberError] = useState("");
    const dispatch = useDispatch()
    const [isCollapsed, setIsSidebarCollapsed] = useState(false)
    const [activeTab, setActiveTab] = useState('teams')
    const [searchTerm, setSearchTerm] = useState('')
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
    const [viewMembersTeamId, setViewMembersTeamId] = useState(null);
    // const [teamMembers, setTeamMembers] = useState([]);
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);

    // Redux selectors
    const createdTeams = useSelector((state) => state.getCreatedTeams?.value || [])
    const createdProjects = useSelector((state) => state.getCreatedProjects?.value || [])
    const createdTasks = useSelector((state) => state.getCreatedTasks?.value || [])
    const isLoading = useSelector((state) =>
        state.getCreatedTeams?.loading ||
        state.getCreatedProjects?.loading ||
        state.getCreatedTasks?.loading
    )
    const teamMembers = useSelector((state) => state.getTeamMembers.value)

    useEffect(() => {
        // Fetch user's created content
        dispatch(fetchCreatedTeams())
        dispatch(fetchCreatedProjects())
        dispatch(fetchCreatedTasks())
    }, [dispatch])

    const handleDelete = async (type, id) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                switch (type) {
                    case 'team':
                        await dispatch(deleteTeam(id)).unwrap()
                        break
                    case 'project':
                        await dispatch(deleteProject(id)).unwrap()
                        break
                    case 'task':
                        await dispatch(deleteTask(id)).unwrap()
                        break
                    default:
                        break
                }
                console.log(`${type} deleted successfully`)
            } catch (error) {
                console.error(`Failed to delete ${type}:`, error)
            }
        }
    }

    const handleEdit = (type, item) => {
        setEditingItem({ type, ...item })
        switch (type) {
            case 'team':
                setShowCreateTeamModal(true)
                break
            case 'project':
                setShowCreateProjectModal(true)
                break
            case 'task':
                setShowCreateTaskModal(true)
                break
            default:
                break
        }
    }

    const handleCreateNew = (type) => {
        setEditingItem(null)
        switch (type) {
            case 'team':
                setShowCreateTeamModal(true)
                break
            case 'project':
                setShowCreateProjectModal(true)
                break
            case 'task':
                setShowCreateTaskModal(true)
                break
            default:
                break
        }
    }

    const handleTeamEditSubmit = async (editData) => {
        console.log("Team", editData)
        try {
            const result = await dispatch(updateTeam({ teamId: editData.teamId, name: editData.name })).unwrap()
            dispatch(fetchCreatedTeams())
            console.log("Team updated successfully", result)
        } catch (error) {
            console.log("team updating error", error)
        }

    }

    const handleProjectEditSubmit = async (editData) => {
        console.log("Project", editData)
        try {
            // Get current user ID from JWT token
            const token = Cookies.get("jwtToken")
            let ownerId = null

            if (token) {
                // Decode JWT token to get user ID
                const payload = JSON.parse(atob(token.split('.')[1]))
                ownerId = payload.userId || payload.id || payload.sub
                console.log(ownerId)
            }

            if (!ownerId) {
                console.error('Unable to get user ID from token')
                return
            }

            // Dispatch the updateProject action with all fields directly
            const result = await dispatch(updateProject({
                projectId: editData.projectId,
                name: editData.projectName,
                description: editData.detailedDescription,
                subject: editData.projectSubject,
                teamId: editData.teamId,
                dueDate: editData.dueDate,
                ownerId: ownerId
            })).unwrap()

            console.log('Project updated successfully:', result)

        } catch (error) {
            console.error('Failed to update project:', error)
            // You could show an error notification here
        }
    }

    const handleModalClose = (type) => {
        switch (type) {
            case 'team':
                setShowCreateTeamModal(false)
                break
            case 'project':
                setShowCreateProjectModal(false)
                break
            case 'task':
                setShowCreateTaskModal(false)
                break
            default:
                break
        }
        setEditingItem(null)

        // Refresh data after create/edit
        dispatch(fetchCreatedTeams())
        dispatch(fetchCreatedProjects())
        dispatch(fetchCreatedTasks())
    }

    const filterItems = (items, searchTerm) => {
        if (!searchTerm) return items
        return items.filter(item =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const getActiveData = () => {
        switch (activeTab) {
            case 'teams':
                return filterItems(createdTeams, searchTerm)
            case 'projects':
                return filterItems(createdProjects, searchTerm)
            case 'tasks':
                return filterItems(createdTasks, searchTerm)
            default:
                return []
        }
    }

    const getTabIcon = (tab) => {
        switch (tab) {
            case 'teams':
                return <FiUsers />
            case 'projects':
                return <FiFolder />
            case 'tasks':
                return <FiCheckSquare />
            default:
                return null
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'completed'
            case 'in_progress':
            case 'inprogress':
                return 'inprogress'
            case 'todo':
                return 'todo'
            case 'active':
                return 'active'
            case 'on_hold':
                return 'onhold'
            default:
                return 'default'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'high'
            case 'medium':
                return 'medium'
            case 'low':
                return 'low'
            default:
                return 'medium'
        }
    }

    return (
        <div className='dashboardLayout'>
            <Sidebar isCollapsed={isCollapsed} />
            <Navbar setIsSidebarCollapsed={setIsSidebarCollapsed} isCollapsed={isCollapsed} />

            <div className={`mainContentArea ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='manageTeamsContent'>
                    {/* Header */}
                    <div className='manageTeamsHeader'>
                        <div className='headerInfo'>
                            <h1 className='pageTitle'>Manage Teams</h1>
                            <p className='pageSubtitle'>Manage your teams, projects, and tasks</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className='tabsContainer'>
                        <div className='tabsList'>
                            {['teams', 'projects', 'tasks'].map(tab => (
                                <button
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {getTabIcon(tab)}
                                    <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            className='createNewButton'
                            onClick={() => handleCreateNew(activeTab.slice(0, -1))}
                        >
                            <FiPlus />
                            <span>Create {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}</span>
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className='searchContainer'>
                        <div className='searchInputWrapper'>
                            <FiSearch className='searchIcon' />
                            <input
                                type='text'
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='searchInput'
                            />
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className='contentGrid'>
                        {isLoading ? (
                            <div className='loadingState'>Loading...</div>
                        ) : getActiveData().length === 0 ? (
                            <div className='emptyState'>
                                <div className='emptyIcon'>{getTabIcon(activeTab)}</div>
                                <h3>No {activeTab} found</h3>
                                <p>Create your first {activeTab.slice(0, -1)} to get started</p>
                            </div>
                        ) : (
                            getActiveData().map(item => (
                                <div key={item.id} className='itemCard'>
                                    <div className='itemHeader'>
                                        {activeTab === 'teams' ? (
                                            <h3
                                                className='itemTitle'
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                onClick={async () => {
                                                    setViewMembersTeamId(item.id);
                                                    setViewMembersModalOpen(true);
                                                    dispatch(fetchTeamMember(item.id));
                                                }}
                                            >
                                                {item.name || item.title}
                                            </h3>
                                        ) : (
                                            <h3 className='itemTitle'>{item.name || item.title}</h3>
                                        )}
                                        <div>
                                            <div className='itemActions'>
                                                <button
                                                    className='actionButton edit'
                                                    onClick={() => handleEdit(activeTab.slice(0, -1), item)}
                                                    title={`Edit ${activeTab.slice(0, -1)}`}
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    className='actionButton delete'
                                                    onClick={() => handleDelete(activeTab.slice(0, -1), item.id)}
                                                    title={`Delete ${activeTab.slice(0, -1)}`}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                            {activeTab === 'teams' && (
                                                <button
                                                    className='add-member'
                                                    title='Add Member'
                                                    onClick={() => {
                                                        setAddMemberTeamId(item.id);
                                                        setShowAddMemberModal(true);
                                                        setAddMemberUsername("");
                                                        setAddMemberError("");

                                                    }}
                                                >
                                                    Add Member
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className='itemContent'>
                                        <p className='itemDescription'>{item.description}</p>

                                        <div className='itemMeta'>
                                            {item.status && (
                                                <span className={`statusBadge ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            )}
                                            {item.priority && (
                                                <span className={`priorityBadge ${getPriorityColor(item.priority)}`}>
                                                    {item.priority} Priority
                                                </span>
                                            )}
                                            {item.dueDate && (
                                                <span className='dueDateBadge'>
                                                    Due: {new Date(item.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            {item.createdAt && (
                                                <span className='createdBadge'>
                                                    Created: {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <div className='modalOverlay'>
                    <div className='modalContent'>
                        <h2>Add Member to Team</h2>
                        <input
                            type='text'
                            placeholder='Enter member username'
                            value={addMemberUsername}
                            onChange={e => setAddMemberUsername(e.target.value)}
                            className='modalInput'
                        />
                        {addMemberError && <div className='modalError'>{addMemberError}</div>}
                        <div className='modalActions'>
                            <button
                                className='modalButton'
                                onClick={async () => {
                                    if (!addMemberUsername.trim()) {
                                        setAddMemberError('Username is required');
                                        return;
                                    }
                                    try {
                                        await dispatch(addMemberToTeam({ teamId: addMemberTeamId, username: addMemberUsername })).unwrap();
                                        setShowAddMemberModal(false);
                                        setAddMemberUsername("");
                                        setAddMemberError("");
                                        dispatch(fetchCreatedTeams());
                                    } catch (err) {
                                        setAddMemberError(err || 'Failed to add member');
                                    }
                                }}
                            >
                                Add
                            </button>
                            <button
                                className='modalButton cancel'
                                onClick={() => setShowAddMemberModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CreateTeamModal
                isOpen={showCreateTeamModal}
                onClose={() => handleModalClose('team')}
                onSubmit={handleTeamEditSubmit}
                editData={editingItem?.type === 'team' ? editingItem : null}
            />

            <CreateProjectModal
                isOpen={showCreateProjectModal}
                onClose={() => handleModalClose('project')}
                onSubmit={handleProjectEditSubmit}
                editData={editingItem?.type === 'project' ? editingItem : null}
            />

            <CreateTaskModal
                isOpen={showCreateTaskModal}
                onClose={() => handleModalClose('task')}
                editData={editingItem?.type === 'task' ? editingItem : null}
            />

            {/* View Members Modal */}
            {viewMembersModalOpen && (
                <div className='modalOverlay'>
                    <div className='modalContent'>
                        <h2 className='team-members-title'>Team Members</h2>
                        {teamMembersLoading ? (
                            <div>Loading...</div>
                        ) : teamMembers.length === 0 ? (
                            <div>No members found.</div>
                        ) : (
                            <ul className='team-members-list'>
                                {teamMembers.map(member => (
                                    member.id != getCurrentUserId()&&<li key={member.id} className='team-member-item'>
                                        <div className='team-member-info'>
                                            <div className='team-member-avatar'
                                                style={{ backgroundColor: `${stringToColor(member.fullName)}` }}
                                            >
                                                {getInitials(member.fullName)}
                                            </div>
                                            <span className='team-member-name'>{member.fullName || member.name || member.username}</span>
                                        </div>
                                        <button
                                            className='modalButton remove team-member-remove'
                                            onClick={async () => {
                                                // TODO: dispatch remove member action here
                                            
                                                try {
                                                    await dispatch(removeMemberFromTeam({ teamId: viewMembersTeamId, memberId: member.id })).unwrap()
                                                    dispatch(fetchTeamMember(viewMembersTeamId))
                                                } catch (err) {
                                                    setAddMemberError(err || 'Failed to remove member');
                                                }
                                                //   alert('Remove member feature not implemented');
                                            }}
                                        >Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className='modalActions team-members-actions'>
                            <button
                                className='modalButton cancel team-members-close'
                                onClick={() => setViewMembersModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageTeams