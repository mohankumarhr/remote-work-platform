import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import CreateTeamModal from '../Components/CreateTeamModal'
import '../Styles/Teams.css'
import { FiPlus, FiUsers, FiFolder, FiCalendar, FiUser, FiMail, FiPhone } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTeamMember, fetchTeamsByUser, createTeam } from '../API/teamAPI'
import { fetchProjectByTeam } from '../API/ProjectAPI'
import { projectsData } from '../data'
import Cookies from 'js-cookie'
import BackgroundLetterAvatars from '../Components/Avatar'
// import { teamsData, membersData, projectsDetailedData } from '../data'
// import {projectsDetailedData } from '../data'
import { getInitials, stringToColor } from '../data'

function Teams() {

    const dispatch = useDispatch();

    // const projectsDetailedData = []
    const teamsData = useSelector((state) => state.getMemberedTeam.value)
    const teamMembers = useSelector((state) => state.getTeamMembers.value)
    const teamProjects = useSelector((state) => state.getProject.value)
    const isLoading = useSelector((state) => state.getMemberedTeam.loading)
    const error = useSelector((state) => state.getMemberedTeam.error)

    const [isCollapsed, setIsSidebarCollapsed] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState(teamsData[0]?.id || null)
    const [showCreateTeam, setShowCreateTeam] = useState(false)
    const [expandedProject, setExpandedProject] = useState(null)
    const [selectedMember, setSelectedMember] = useState(null)
    const [showMemberDetails, setShowMemberDetails] = useState(false)

    const currentTeam = teamsData.find(team => team.id === selectedTeam)
    
    // Get members for the current team
    // const teamMembers = currentTeam ? membersData.filter(member => 
    //     currentTeam.memberIds.includes(member.id)
    // ) : []
    
    // const teamProjects = projectsDetailedData.filter(project => 
    //     currentTeam?.projects.includes(project.id)
    // )
    

     useEffect(()=>{
            dispatch(fetchTeamsByUser())
            // console.log(apiTask)
    }, [dispatch])


    useEffect(()=>{
        console.log("hi")
            if (teamsData.length > 0) {
                setSelectedTeam(teamsData[0].id)
                dispatch(fetchTeamMember(teamsData[0].id))
                dispatch(fetchProjectByTeam(teamsData[0].id))
            }
    }, [teamsData])


    const handleCreateTeam = () => {
        setShowCreateTeam(true)
        console.log(teamMembers)
        console.log(teamProjects)
    }

    const closeCreateTeam = () => {
        setShowCreateTeam(false)
    }

    const handleTeamSubmit = async (teamData) => {
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
            
            // Dispatch the createTeam action
            const result = await dispatch(createTeam({ 
                name: teamData.name, 
                ownerId: ownerId 
            })).unwrap()
            
            console.log('Team created successfully:', result)
            
            // Refresh the teams list
            dispatch(fetchTeamsByUser())
            
            // Close the modal
            closeCreateTeam()
            
        } catch (error) {
            console.error('Failed to create team:', error)
            // You could show an error notification here
        }
    }

    const toggleProject = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId)
    }

    const handleMemberClick = (member) => {
        console.log(member)
        setSelectedMember(member)
        setShowMemberDetails(true)
    }

    const closeMemberDetails = () => {
        setShowMemberDetails(false)
        setSelectedMember(null)
    }

    const handleTeamSelection = (teamId) => {
        setSelectedTeam(teamId)
        dispatch(fetchTeamMember(teamId))
        dispatch(fetchProjectByTeam(teamId))
    }

    return (
        <div className='dashboardLayout'>
            <Sidebar isCollapsed={isCollapsed} />
            <Navbar setIsSidebarCollapsed={setIsSidebarCollapsed} isCollapsed={isCollapsed} />
            
            <div className={`mainContentArea ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='teamsContent'>
                    {/* Header */}
                    <div className='teamsHeader'>
                        <div className='headerInfo'>
                            <h1 className='pageTitle'>Teams</h1>
                            <p className='pageSubtitle'>Manage your teams, members, and projects</p>
                        </div>
                        <button 
                            className='createTeamBtn' 
                            onClick={handleCreateTeam}
                            disabled={isLoading}
                        >
                            <FiPlus />
                            <span>{isLoading ? 'Creating...' : 'Create Team'}</span>
                        </button>
                    </div>

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

                    {/* Team Selection */}
                    <div className='teamTabs'>
                        {teamsData.map(team => {
                            // const memberCount = membersData.filter(member => 
                            //     team.memberIds.includes(member.id)
                            // ).length
                            
                            return (
                                <button
                                    key={team.id}
                                    className={`teamTab ${selectedTeam === team.id ? 'active' : ''}`}
                                    onClick={() => handleTeamSelection(team.id)}
                                >
                                    <span className='teamName'>{team.name}</span>
                                    {/* <span className='memberCount'>{memberCount} members</span> */}
                                </button>
                            )
                        })}
                    </div>

                    {currentTeam && (
                        <div className='teamContent'>
                            {/* Team Overview */}
                            <div className='teamOverview'>
                                <div className='teamInfo'>
                                    <div className='teamHeader'>
                                        <div>
                                            <h2 className='teamTitle'>{currentTeam.name}</h2>
                                            <p className='teamDescription'>{currentTeam.description}</p>
                                        </div>
                                    </div>
                                    <div className='teamStats'>
                                        <div className='stat'>
                                            <FiUsers className='statIcon' />
                                            <span className='statValue'>{teamMembers.length}</span>
                                            <span className='statLabel'>Members</span>
                                        </div>
                                        <div className='stat'>
                                            <FiFolder className='statIcon' />
                                            <span className='statValue'>{teamProjects.length}</span>
                                            <span className='statLabel'>Projects</span>
                                        </div>
                                        <div className='stat'>
                                            <FiCalendar className='statIcon' />
                                            <span className='statValue'>
                                                {/* {currentTeam.createdAt} */}
                                                {new Date(currentTeam.createdAt).toLocaleString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className='statLabel'>Created</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='teamMainContent'>
                                {/* Team Members */}
                                <div className='contentSection'>
                                    <h3 className='sectionTitle'>Team Members</h3>
                                    <div className='membersList'>
                                        {teamMembers.map(member => (
                                            <div key={member.id} className='memberCard'>
                                                <div className='memberAvatar'
                                                style={{backgroundColor:`${stringToColor(member.fullName)}`}}
                                                >
                                                    {getInitials(member.fullName)}
                                                </div>
                                                <div className='memberInfo'>
                                                    <h4 
                                                        className='memberName clickable'
                                                        onClick={() => handleMemberClick(member)}
                                                    >
                                                        {/* {member.name} */}
                                                        {member.fullName}
                                                    </h4>
                                                    <p className='memberRole'>{member.department}</p>
                                                </div>
                                                <div className='memberStatus'>
                                                    <span className={`statusIndicator ${member.status}`}></span>
                                                    <span className='statusText'>{member.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Team Projects */}
                                 <div className='contentSection'>
                                    <h3 className='sectionTitle'>Team Projects</h3>
                                    <div className='projectsList'>
                                        {teamProjects.map(project => (
                                            <div key={project.id} className='projectCard'>
                                                <div 
                                                    className='projectHeader'
                                                    onClick={() => toggleProject(project.id)}
                                                >
                                                    <div className='projectBasicInfo'>
                                                        <h4 className='projectName'>{project.name}</h4>
                                                        <p className='projectDescription'>{project.description}</p>
                                                        <div className='projectMeta'>
                                                            <span className={`projectStatus ${project.status}`}>
                                                                {project.status}
                                                            </span>
                                                            <span className='projectDue'>{project.startDate}</span>
                                                            {/* <span className='projectPriority'>{project.priority} Priority</span> */}
                                                        </div>
                                                    </div>
                                                    <div className='projectStats'>
                                                        <div className='progressInfo'>
                                                            <span className='progressText'>{project.progress}%</span>
                                                            <div className='progressBar'>
                                                                <div 
                                                                    className={`progressFill ${project.status}`}
                                                                    style={{ width: `${project.progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className='expandIcon'>
                                                            {expandedProject === project.id ? '▼' : '▶'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {expandedProject === project.id && (
                                                    <div className='projectDetails'>
                                                        <div className='projectFullDescription'>
                                                            <h5>Project Details</h5>
                                                            <p>{project.fullDescription}</p>
                                                        </div>
                                                        
                                                        <div className='projectTasks'>
                                                            <h5>Tasks ({project.tasks.length})</h5>
                                                            <div className='tasksList'>
                                                                {project.tasks.map(task => (
                                                                    <div key={task.id} className='taskItem'>
                                                                        <div className='taskHeader'>
                                                                            <div className='taskInfo'>
                                                                                <h6 className='taskTitle'>{task.title}</h6>
                                                                                <p className='taskDescription'>{task.description}</p>
                                                                            </div>
                                                                            <div className='taskMeta'>
                                                                                <span className={`taskStatus ${task.status}`}>
                                                                                    {task.status}
                                                                                </span>
                                                                                <span className='taskAssignee'>
                                                                                    {task.assignee}
                                                                                </span>
                                                                                <span className='taskDue'>{task.dueDate}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div> 
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Member Details Modal */}
            {showMemberDetails && selectedMember && (
                <div className='modalOverlay' onClick={closeMemberDetails}>
                    <div className='memberModal' onClick={(e) => e.stopPropagation()}>
                        <div className='modalHeader'>
                            <h3>Member Details</h3>
                            <button className='closeButton' onClick={closeMemberDetails}>×</button>
                        </div>
                        <div className='modalContent'>
                            <div className='memberDetailCard'>
                                <div className='memberDetailAvatar'
                                    style={{backgroundColor:`${stringToColor(selectedMember.fullName)}`}}
                                >
                                     {getInitials(selectedMember.fullName)}
                                </div>
                                
                                <div className='memberDetailInfo'>
                                    <h4 className='memberDetailName'>{selectedMember.fullName}</h4>
                                    <p className='memberDetailRole'>{selectedMember.role}</p>
                                    <div className='memberDetailStatus'>
                                        <span className={`statusIndicator ${selectedMember.status}`}></span>
                                        <span className='statusText'>{selectedMember.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='contactDetails'>
                                <h5>Contact Information</h5>
                                <div className='contactItem'>
                                    <FiMail className='contactIcon' />
                                    <span>{selectedMember.email}</span>
                                </div>
                                <div className='contactItem'>
                                    <FiPhone className='contactIcon' />
                                    <span>{selectedMember.phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Team Modal */}
            <CreateTeamModal 
                isOpen={showCreateTeam}
                onClose={closeCreateTeam}
                onSubmit={handleTeamSubmit}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Teams
