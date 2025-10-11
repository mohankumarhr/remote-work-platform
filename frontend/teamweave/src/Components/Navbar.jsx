import React, { useState, useRef, useEffect } from 'react'
import { FiSearch, FiBell, FiSettings, FiUser, FiUsers, FiActivity, FiLogOut } from "react-icons/fi";
import { FiSidebar } from "react-icons/fi";
import "../Styles/Navbar.css"
import BackgroundLetterAvatars from './Avatar';
import { useNavigate } from 'react-router-dom';

function Navbar({ setIsSidebarCollapsed, isCollapsed }) {

    const navigate = useNavigate()

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleDropdownItemClick = (action) => {
        switch(action){
            case "Profile":
                navigate("/profile")
                break
            case "Manage Teams":
                navigate("/manage")
                break
        }
        setIsDropdownOpen(false);
        // Add your action handlers here
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    
    return (
        <div className={`NavbarContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='navbarWrapper'>
                <div className="sideBarCollapseCont" onClick={handleToggleSidebar} >
                    <FiSidebar className='sideBarCollapseBtn'/>
                </div>
                {/* Search Section */}
                <div className='searchSection'>
                    <FiSearch className='searchIcon' />
                    <input 
                        type="text" 
                        placeholder="Search teams, tasks, messages..." 
                        className='searchInput'
                    />
                </div>

                {/* Right Section */}
                <div className='rightSection'>
                    {/* Quick Actions */}
                    <div className='quickActions'>
                        <button className='actionButton'>
                            <span className='newTaskIcon'>📋</span>
                            New Task
                        </button>
                        <button className='actionButton meetingButton'>
                            <span className='meetingIcon'>🎥</span>
                            Start Meeting
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className='notificationSection'>
                        <div className='iconButton notificationBadge'>
                            <FiBell />
                            <span className='badge'>3</span>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className='userSection' onClick={toggleDropdown} ref={dropdownRef}>
                        <div className='userAvatar'>JD</div>
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className='userDropdown'>
                                <div className='dropdownHeader'>
                                    <div className='dropdownAvatar'>JD</div>
                                    <div className='dropdownUserInfo'>
                                        <span className='dropdownUserName'>John Doe</span>
                                        <span className='dropdownUserRole'>Admin</span>
                                    </div>
                                </div>
                                <div className='dropdownItems'>
                                    <div className='dropdownItem' onClick={() => handleDropdownItemClick('Profile')}>
                                        <FiUser className='dropdownIcon' />
                                        <span>Profile</span>
                                    </div>
                                    <div className='dropdownItem' onClick={() => handleDropdownItemClick('Settings')}>
                                        <FiSettings className='dropdownIcon' />
                                        <span>Settings</span>
                                    </div>
                                    <div className='dropdownItem' onClick={() => handleDropdownItemClick('Manage Teams')}>
                                        <FiUsers className='dropdownIcon' />
                                        <span>Manage Teams</span>
                                    </div>
                                    <div className='dropdownItem' onClick={() => handleDropdownItemClick('Set Status')}>
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
        </div>
    )
}

export default Navbar