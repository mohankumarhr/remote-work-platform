import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import '../Styles/Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, UpdateUserDetails } from '../API/UserAPI';
import axios from 'axios';

function Profile() {

  const dispatch = useDispatch();

  const [isCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // State to manage edit mode
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    designation: '',
    department: '',
    userName: '',
    profilePictureUrl: '',
    role: '',
    status: '',
    id: ''
  });

  const details = useSelector((state) => state.getUserDetails.value)

  // Handle the toggle for edit mode
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleSave = async () => {
    try {
      await dispatch(UpdateUserDetails({ details: fields, id: fields.id }));
      setIsEditable(false);
      dispatch(fetchUserDetails()); // Refresh details after update
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    dispatch(fetchUserDetails())
    setIsEditable(false);
  };

  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [dispatch])

  useEffect(() => {
  if (details) {
    setFields({
      fullName: details.fullName || '',
      email: details.email || '',
      phoneNumber: details.phoneNumber || '',
      designation: details.designation || '',
      department: details.department || '',
      userName: details.userName || '',
      profilePictureUrl: details.profilePictureUrl || '',
      role: details.role || '',
      status: details.status || '',
      id: details.id || ''
    });
  }
}, [details]);


  return (
    <div className='dashboardLayout'>
      <Sidebar isCollapsed={isCollapsed} />
      <Navbar setIsSidebarCollapsed={setIsSidebarCollapsed} isCollapsed={isCollapsed} />
      <div className={`mainContentArea ${isCollapsed ? 'collapsed' : ''}`}>
        <div className='profileWrapper'>
          <div className='profilePictureWrapper'>
            <div className='profileImage'></div>
          </div>
          <div className='profileDetailsWrapper'>
            <div className='profileDetails'>
              <h2 className="sectionTitle">Personal Information</h2>
              <div className='profileFields'>
                <label>Full Name</label>
                <input
                  placeholder="Enter your Full Name"
                  value={fields.fullName}
                  onChange={(e) => setFields({ ...fields, fullName: e.target.value })}
                  disabled={!isEditable} // Disable input if not in edit mode
                />
              </div>
              <div className='profileFields'>
                <label>Email</label>
                <input
                  placeholder="Enter your email"
                  value={fields.email}
                  onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  disabled={true}
                />
              </div>
              <div className='profileFields'>
                <label>Phone Number</label>
                <input
                  placeholder="Enter your phone number"
                  value={fields.phoneNumber}
                  onChange={(e) => setFields({ ...fields, phoneNumber: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
              <div className='profileFields'>
                <label>UserName</label>
                <input
                  placeholder="Enter your username"
                  defaultValue={fields.userName} // Use defaultValue instead of value for non-editable fields
                  disabled={true}
                  // onChange={(e) => setFields({ ...fields, userName: e.target.value })}
                />
              </div>
            </div>
            <div className='profileDetails'>
              <h2 className="sectionTitle">Job Details</h2>
              <div className='profileFields'>
                <label>Designation</label>
                <input
                  placeholder="Enter your designation"
                  value={fields.designation}
                  onChange={(e) => setFields({ ...fields, designation: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
              <div className='profileFields'>
                <label>Department</label>
                <input
                  placeholder="Enter your department"
                  value={fields.department}
                  onChange={(e) => setFields({ ...fields, department: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="editButtonWrapper">
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 16 }}>
                {isEditable ? (
                  <>
                    <button className='profile-action-btn' onClick={handleSave}>Save</button>
                    <button className='profile-action-btn profile-cancel-btn' onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button className='profile-action-btn' onClick={handleEditToggle}>Edit</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
