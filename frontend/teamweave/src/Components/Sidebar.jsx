import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { AiOutlineTeam } from "react-icons/ai";
import { HiOutlineHome } from "react-icons/hi";
import { MdTaskAlt } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { CiVideoOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { SiSimpleanalytics } from "react-icons/si";
import { CiSettings } from "react-icons/ci";
import { HiChevronLeft } from "react-icons/hi";
import CreateProjectModal from './CreateProjectModal';
import { createProject } from '../API/ProjectAPI';
import '../Styles/Sidebar.css';

function Sidebar({ isCollapsed }) {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
    
    // Get loading state from Redux store
    const isLoading = useSelector((state) => state.getProject.loading)

    const handleNavigation = (path) => {
        navigate(path)
    }

    const handleCreateProject = async (projectData) => {
        console.log('New project created:', projectData)
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

            // Dispatch the createProject action
            const result = await dispatch(createProject({
                name: projectData.projectName,
                description: projectData.detailedDescription,
                subject: projectData.projectSubject,
                teamId: projectData.teamId,
                dueDate: projectData.dueDate,
                ownerId: ownerId
            })).unwrap()

            console.log('Project created successfully:', result)
            setIsCreateProjectModalOpen(false)

        } catch (error) {
            console.error('Failed to create project:', error)
            // You could show an error notification here
        }
    }

    return (
        <div className={`sideBarContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='sidebarWrapper'>
                {/* Logo Section */}
                <div className='logoContainer'>
                    <div className='logoIcon'></div>
                    <div className='logoText'>TeamWeave</div>
                </div>

                {/* Workspace Section */}
                <div className='workspaceSection'>
                    <div className='sectionTitle'>WORKSPACE</div>
                    <div className='workspace'>
                        <div
                            className={`sidebarMenuItem ${location.pathname === '/' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/')}
                        >
                            <HiOutlineHome />
                            <span>Dashboard</span>
                        </div>
                        <div
                            className={`sidebarMenuItem ${location.pathname === '/teams' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/teams')}
                        >
                            <AiOutlineTeam />
                            <span>Teams</span>
                        </div>
                        <div
                            className={`sidebarMenuItem ${location.pathname === '/tasks' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/tasks')}
                        >
                            <MdTaskAlt />
                            <span>Tasks</span>
                        </div>
                        <div
                            className={`sidebarMenuItem ${location.pathname === '/chat' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/chat')}
                        >
                            <FiMessageSquare />
                            <span>Messages</span>
                        </div>
                        <div className="sidebarMenuItem">
                            <CiVideoOn />
                            <span>Meetings</span>
                        </div>
                        <div className="sidebarMenuItem">
                            <CiCalendar />
                            <span>Calendar</span>
                        </div>
                    </div>
                </div>

                {/* New Project Button */}
                <button
                    className={`ProjectCreationButton ${isLoading ? 'loading' : ''}`}
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    disabled={isLoading}
                >
                    <CiCirclePlus />
                    <span>{isLoading ? 'Creating...' : 'New Project'}</span>
                </button>

                {/* Tools Section */}
                <div className="toolsSection">
                    <div className='toolsTitle'>TOOLS</div>
                    <div className="sidebarMenuItem">
                        <SiSimpleanalytics />
                        <span>Analytics</span>
                    </div>
                    <div className="sidebarMenuItem">
                        <CiSettings />
                        <span>Settings</span>
                    </div>
                </div>
            </div>

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                onSubmit={handleCreateProject}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Sidebar