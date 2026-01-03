import React, { useState, useRef, useEffect } from 'react'
import { FiSearch, FiBell, FiSettings, FiUser, FiUsers, FiActivity, FiLogOut } from "react-icons/fi";
import { FiSidebar } from "react-icons/fi";
import "../Styles/Navbar.css"
import BackgroundLetterAvatars from './Avatar';
import { useNavigate } from 'react-router-dom';
import MeetingModal from './MeetingModal';
import { useSelector } from 'react-redux';
import { getInitials } from '../data';
import CreateTaskModal from './CreateTaskModal';

function Navbar({ setIsSidebarCollapsed, isCollapsed }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isMeetingOpen, setIsMeetingOpen] = useState(false);
    const navigate = useNavigate();

    const [showCreateTask, setShowCreateTask] = useState(false)

    const user = useSelector((state) => state.getUserDetails.value)

    const handleToggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handleDropdownItemClick = (action) => {
        switch (action) {
            case 'Profile':
                navigate('/profile');
                break;
            case 'Manage Teams':
                navigate('/manage');
                break;
            default:
                break;
        }
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeCreateTask = () => {
        setShowCreateTask(false)
    }


    return (
        <div className={`NavbarContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='navbarWrapper'>
                <div className="sideBarCollapseCont" onClick={handleToggleSidebar} >
                    <FiSidebar className='sideBarCollapseBtn' />
                </div>
                <div className='searchSection'>
                    <FiSearch className='searchIcon' />
                    <input
                        type="text"
                        placeholder="Search teams, tasks, messages..."
                        className='searchInput'
                    />
                </div>

                <div className='rightSection'>
                    <div className='quickActions'>
                        <button className='actionButton' onClick={()=>{setShowCreateTask(true)}}>
                            <span className='newTaskIcon'>📋</span>
                            New Task
                        </button>
                        <button className='actionButton meetingButton' onClick={() => setIsMeetingOpen(true)}>
                            <span className='meetingIcon'>🎥</span>
                            Start Meeting
                        </button>
                    </div>

                    <MeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />

                    <div className='notificationSection'>
                        <div className='iconButton notificationBadge btndisabled'>
                            <FiBell />
                            <span className='badge'>x</span>
                        </div>
                    </div>

                    <div className='userSection' onClick={toggleDropdown} ref={dropdownRef}>
                        <div className='userAvatar'>{getInitials(user.fullName)}</div>
                        {isDropdownOpen && (
                            <div className='userDropdown'>
                                <div className='dropdownHeader'>
                                    <div className='dropdownAvatar'>{getInitials(user.fullName)}</div>
                                    <div className='dropdownUserInfo'>
                                        <span className='dropdownUserName'>{user.fullName}</span>
                                        <span className='dropdownUserRole'>{user.designation}</span>
                                    </div>
                                </div>
                                <div className='dropdownItems'>
                                    <div className='dropdownItem' onClick={() => handleDropdownItemClick('Profile')}>
                                        <FiUser className='dropdownIcon' />
                                        <span>Profile</span>
                                    </div>
                                    <div className='dropdownItem' onClick={() => handleDropdownItemClick('Manage Teams')}>
                                        <FiUsers className='dropdownIcon' />
                                        <span>Manage Teams</span>
                                    </div>
                                    <div className='dropdownItem btndisabled' onClick={() => handleDropdownItemClick('Settings')}>
                                        <FiSettings className='dropdownIcon' />
                                        <span>Settings</span>
                                    </div>
                                    <div className='dropdownItem btndisabled' onClick={() => handleDropdownItemClick('Set Status')}>
                                        <FiActivity className='dropdownIcon' />
                                        <span>Set Status</span>
                                    </div>
                                    <div className='dropdownDivider'></div>
                                    <div className='dropdownItem logout' onClick={() => handleDropdownItemClick('Log Out')}>
                                        <FiLogOut className='dropdownIcon' />
                                        <span>Log Out</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
             {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={showCreateTask}
                onClose={closeCreateTask}
            />
        </div>
    )
}

export default Navbar