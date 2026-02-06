// Custom styled call notification modal
const CallNotification = ({ peerId, callerName, onAccept, onReject, closeToast }) => {
  
  const handleAccept = () => {
    onAccept();
    if (closeToast) closeToast();
  };

  const handleReject = () => {
    onReject();
    if (closeToast) closeToast();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          color: '#333',
          fontSize: '24px'
        }}>Incoming Call</h2>
        <p style={{
          margin: '0 0 8px 0',
          color: '#666',
          fontSize: '16px'
        }}>{callerName ? `${callerName} is calling you...` : `User ${peerId} is calling you...`}</p>
        <p style={{
          margin: '0 0 22px 0',
          color: '#999',
          fontSize: '13px'
        }}>Caller ID: {peerId}</p>
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button 
            onClick={handleAccept}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
          >
            <span>✓</span> Accept
          </button>
          <button
            onClick={handleReject}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            <span>✕</span> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification