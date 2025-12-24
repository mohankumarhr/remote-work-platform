import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getUserDetailsFromToken } from '../API/AuthAPI'; // <-- Make sure you have this API function
import { getCurrentUserId } from '../data';

// Helper function to get a cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
};

// A simple loading component (you can replace this with a spinner)
const FullPageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h2>Loading...</h2>
  </div>
);

const ProtectedLayout = () => {
  const [authStatus, setAuthStatus] = useState('loading');
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('jwtToken');

      if (!token) {
        setAuthStatus('public');
        return;
      }

      try {
        // Call your API to get user details
        const userDetails = await getUserDetailsFromToken(getCurrentUserId());

        if (userDetails && userDetails.emailVerified) {
          // Case 1: Logged in AND verified
          setAuthStatus('verified');
        } else if (userDetails && !userDetails.emailVerified) {
          // Case 2: Logged in but NOT verified
         
          setUserEmail(userDetails.email || '');
          // setAuthStatus('unverified');
          setAuthStatus('unverified');
        } else {
          // This should not happen, but as a fallback
          setAuthStatus('public');
        }
      } catch (error) {
        // Case 3: Token is invalid or API failed
        console.error('Auth check failed', error);
        // setAuthStatus('public');
         setAuthStatus('verified');
      }
    };

    checkAuth();
  }, [location.key]); // Re-check on route change if needed, or use [] for once on mount

  // --- Render logic based on authStatus ---

  if (authStatus === 'loading') {
    return <FullPageLoader />;
  }

  if (authStatus === 'public') {
    // If no token (or invalid), redirect to login
    return <Navigate to="/login" replace />;
  }

  if (authStatus === 'unverified') {
    // If logged in but not verified, redirect to verify page
    // We add the email as a query param
    return <Navigate to={`/verify?email=${userEmail}`} replace />;
  }

  // If authStatus === 'verified'
  // Render the protected child route (Dashboard, Profile, etc.)
  return <Outlet />;
};

export default ProtectedLayout;
