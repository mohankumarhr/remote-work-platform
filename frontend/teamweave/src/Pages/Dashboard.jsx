import React, { useState, useEffect } from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import CreateTeamModal from '../Components/CreateTeamModal'
import CreateTaskModal from '../Components/CreateTaskModal'
import '../Styles/Dashboard.css'
import StatCard from '../Components/StatCard';
import { AiOutlineTeam } from "react-icons/ai";
import { FiCheckSquare, FiMessageSquare, FiClock } from "react-icons/fi";
import { statsData, projectsData, activitiesData, meetingsData, quickActionsData } from '../data';

function Dashboard() {

    const [isCollapsed, setIsSidebarCollapsed] = useState(false)
    const [showCreateTeam, setShowCreateTeam] = useState(false)
    const [showCreateTask, setShowCreateTask] = useState(false)

    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Icon mapping
    const iconMap = {
        team: AiOutlineTeam,
        task: FiCheckSquare,
        message: FiMessageSquare,
        clock: FiClock
    };


    const processedMeeting = meetingsData.slice(0, 3)
        .map(meeting => {
            // Parse the datetime string
            const meetingDateTime = new Date(meeting.time);
            const currentDateTime = new Date();
            
            // Calculate time difference in minutes
            const timeDifferenceMs = meetingDateTime.getTime() - currentDateTime.getTime();
            const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
            
            // Format time for display (e.g., "4:14 PM")
            const displayTime = meetingDateTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            // Format date for display
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let displayDate = '';
            if (meetingDateTime.toDateString() === today.toDateString()) {
                displayDate = 'Today';
            } else if (meetingDateTime.toDateString() === tomorrow.toDateString()) {
                displayDate = 'Tomorrow';
            } else {
                displayDate = meetingDateTime.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            }
            
            // Determine button type based on time difference
            let buttonType, buttonText;
            
            if (timeDifferenceMinutes < -30) {
                // Meeting ended more than 30 minutes ago
                buttonType = 'details';
                buttonText = 'Details';
            } else if (timeDifferenceMinutes >= -30 && timeDifferenceMinutes <= 30) {
                // Meeting is happening now or within 30 minutes (before/after)
                buttonType = 'join';
                buttonText = 'Join';
            } else {
                // Meeting is more than 30 minutes in the future
                buttonType = 'details';
                buttonText = 'Details';
            }
            
            return {
                ...meeting,
                displayTime: displayDate === 'Today' ? displayTime : `${displayDate} ${displayTime}`,
                buttonType,
                buttonText,
                timeDifferenceMinutes,
                isLive: timeDifferenceMinutes >= -15 && timeDifferenceMinutes <= 15, // Meeting is live
                isUpcoming: timeDifferenceMinutes > 0 && timeDifferenceMinutes <= 60 // Meeting starts within an hour
            };
        });

    // Manipulate projects data before mapping
    const processedProjects = projectsData
        .slice(0, 3) // Limit to 3 projects
        .map(project => {
            // Calculate actual progress percentage
            const actualProgress = Math.round((project.completedTasks / project.totalTasks) * 100);

            // Determine status based on progress and due date
            let computedStatus = project.status;
            let computedStatusText = project.statusText;

            // Add logic to determine status dynamically
            if (actualProgress >= 90) {
                computedStatus = 'ahead';
                computedStatusText = 'Ahead';
            } else if (actualProgress >= 70) {
                computedStatus = 'onTrack';
                computedStatusText = 'On Track';
            } else if (actualProgress < 50) {
                computedStatus = 'atRisk';
                computedStatusText = 'At Risk';
            }

            // Add additional computed properties
            return {
                ...project,
                actualProgress,
                computedStatus,
                computedStatusText,
                remainingTasks: project.totalTasks - project.completedTasks,
                isUrgent: actualProgress < 30,
                progressCategory: actualProgress >= 75 ? 'high' : actualProgress >= 50 ? 'medium' : 'low'
            };
        })
        // Sort by progress (highest first)
        .sort((a, b) => b.actualProgress - a.actualProgress);

    const handleQuickAction = (action) => {
        if (action === 'createTeam') {
            setShowCreateTeam(true)
        } else if (action === 'addTask') {
            setShowCreateTask(true)
        }
        // Add other quick actions here
        console.log('Quick action:', action)
    }

    const closeCreateTeam = () => {
        setShowCreateTeam(false)
    }

    const closeCreateTask = () => {
        setShowCreateTask(false)
    }

    const handleTeamSubmit = (teamData) => {
        // Here you would typically add the team to your data/backend
        console.log('Creating team:', teamData)
        // Close the modal
        closeCreateTeam()
        // You could add success notification here
    }

    const handleTaskSubmit = (taskData) => {
        // Here you would typically add the task to your data/backend
        console.log('Creating task:', taskData)
        // Close the modal
        closeCreateTask()
        // You could add success notification here
    }

    return (
        <div className='dashboardLayout'>
            <Sidebar isCollapsed={isCollapsed} />
            <Navbar setIsSidebarCollapsed={setIsSidebarCollapsed} isCollapsed={isCollapsed} />
            {/* Main Content Area */}
            <div className={`mainContentArea ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='dashboardContent'>
                    <h1 className='welcomeTitle'>
                        Good morning, John! 👋
                    </h1>
                    <p className='welcomeSubtitle'>
                        Here's what's happening with your teams today.
                    </p>

                    {/* Stats Cards */}
                    <div className='statsGrid'>
                        {statsData.map((stat, index) => (
                            <StatCard
                                key={index}
                                label={stat.label}
                                number={stat.number}
                                subtext={stat.subtext}
                                description={stat.description}
                                icon={iconMap[stat.iconType]}
                                iconColor={stat.iconColor}
                            />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className='dashboardGrid'>
                        {/* Project Progress */}
                        <div className='contentCard'>
                            <h3 className='contentCardTitle'>Project Progress</h3>
                            <div className='projectsList'>
                                {processedProjects.map((project) => (
                                    <div key={project.id} className='projectItem'>
                                        <div className='projectInfo'>
                                            <h4 className='projectName'>{project.name}</h4>
                                            <p className='projectTeam'>{project.team}</p>
                                            <div className='projectMeta'>
                                                <span className={`projectStatus ${project.computedStatus}`}>
                                                    {project.computedStatusText}
                                                </span>
                                                <span className='projectDue'>{project.dueDate}</span>
                                                {project.isUrgent && (
                                                    <span className='urgentBadge'>🚨 Urgent</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className='projectProgress'>
                                            <div className='projectStats'>
                                                <span className='taskCount'>{project.completedTasks}/{project.totalTasks} tasks</span>
                                                <span className='progressText'>{project.actualProgress}%</span>
                                                <span className='remainingTasks'>({project.remainingTasks} left)</span>
                                            </div>
                                            <div className='progressBar'>
                                                <div className={`progressFill ${project.computedStatus}`} style={{ width: `${project.actualProgress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a href="#" className='viewAllLink'>View all projects →</a>
                        </div>

                        {/* Recent Activity */}
                        <div className='contentCard'>
                            <h3 className='contentCardTitle'>Recent Activity</h3>
                            <div className='activityList'>
                                {activitiesData.slice(0, 4).map((activity) => (
                                    <div key={activity.id} className='activityItem'>
                                        <div className='activityAvatar'>{activity.avatar}</div>
                                        <div className='activityContent'>
                                            <p className='activityText'>
                                                <strong>{activity.userName}</strong> {activity.action} <em>{activity.target}</em>
                                            </p>
                                            <span className='activityTime'>{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a href="#" className='viewAllLink'>View all activity →</a>
                        </div>

                        {/* Upcoming Meetings */}
                        <div className='contentCard'>
                            <h3 className='contentCardTitle'>🎥 Upcoming Meetings</h3>
                            <div className='meetingsList'>
                                {processedMeeting.map((meeting) => (
                                    <div key={meeting.id} className='meetingItem'>
                                        <div className='meetingDetails'>
                                            <h4 className='meetingTitle'>
                                                {meeting.title}
                                                {meeting.isLive && <span className='liveBadge'>🔴 Live</span>}
                                                {meeting.isUpcoming && <span className='upcomingBadge'>⏰ Soon</span>}
                                            </h4>
                                            <p className='meetingParticipants'>{meeting.participants}</p>
                                        </div>
                                        <div className='meetingTime'>
                                            <div className='timeSlot'>{meeting.displayTime}</div>
                                            <button className={meeting.buttonType === 'join' ? 'joinButton' : 'detailsButton'}>
                                                {meeting.buttonText}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className='contentCard'>
                            <h3 className='contentCardTitle'>Quick Actions</h3>
                            <div className='quickActionsGrid'>
                                {quickActionsData.map((action) => (
                                    <button 
                                        key={action.id} 
                                        className={`quickActionBtn ${action.action}`}
                                        onClick={() => handleQuickAction(action.action)}
                                    >
                                        <div className='actionIcon'>{action.icon}</div>
                                        <span>{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Create Team Modal */}
            <CreateTeamModal 
                isOpen={showCreateTeam}
                onClose={closeCreateTeam}
                onSubmit={handleTeamSubmit}
            />

            {/* Create Task Modal */}
            <CreateTaskModal 
                isOpen={showCreateTask}
                onClose={closeCreateTask}
                onSubmit={handleTaskSubmit}
            />
        </div>
    )
}


export default Dashboard