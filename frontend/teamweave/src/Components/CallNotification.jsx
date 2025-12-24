// You can put this in the same file or import it

// This is a simple React component that react-toastify will render
const CallNotification = ({ peerId, onAccept, onReject, closeToast }) => {
  
  const handleAccept = () => {
    onAccept();
    closeToast(); // Dismiss the toast
  };

  const handleReject = () => {
    onReject();
    closeToast(); // Dismiss the toast
  };

  return (
    <div>
      <p>Incoming call from User {peerId}</p>
      <button onClick={handleAccept} style={{ marginRight: '10px' }}>
        Accept
      </button>
      <button onClick={handleReject}>
        Reject
      </button>
    </div>
  );
};

export default CallNotification