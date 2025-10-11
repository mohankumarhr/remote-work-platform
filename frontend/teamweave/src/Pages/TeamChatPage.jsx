import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeamsByUser, fetchTeamMember } from "../API/teamAPI";
import ChatRoom from "../Components/ChatRoom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Cookies from "js-cookie";
import "../Styles/TeamChatPage.css";
import { fetchChatByReceiver, fetchTeamChat } from "../API/messagesAPI";
import BackgroundLetterAvatars from "../Components/Avatar";

const getCurrentUserId = () => {
  const token = Cookies.get("jwtToken")
  let userId = null

  if (token) {
    // Decode JWT token to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]))
    userId = payload.userId || payload.id || payload.sub
    
    return userId
  }

  if (!userId) {
    console.error('Unable to get user ID from token')
    return 0
  }
  // const token = Cookies.get("jwtToken");
  // if (!token) return "Me";
  // try {
  //   const payload = JSON.parse(atob(token.split(".")[1]));
  //   return payload.fullName || payload.name || payload.username || payload.email || "Me";
  // } catch {
  //   return "Me";
  // }
};

const TeamChatPage = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.getMemberedTeam.value);
  const membersByTeam = useSelector((state) => state.getTeamMembers.value);
  const [selectedChat, setSelectedChat] = useState({ type: null, id: null, name: null });
  const [allMembers, setAllMembers] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState({
    isTyping : false,
    sender : null
  })

  useEffect(() => {
    dispatch(fetchTeamsByUser());
  }, [dispatch]);

  useEffect(() => {
    if (selectedChat.type === 'member') {
      dispatch(fetchChatByReceiver({ senderId: getCurrentUserId(), receiverId: selectedChat.id }))
    } else if (selectedChat.type === 'team') {
      dispatch(fetchTeamChat({ teamId: selectedChat.id }));
    }
  }, [selectedChat, dispatch])

  useEffect(() => {
    // Fetch members for all teams user is part of
    if (teams.length > 0) {
      Promise.all(teams.map(team => dispatch(fetchTeamMember(team.id)))).then((results) => {
        // Flatten all members, remove duplicates by id
        const memberMap = {};
        results.forEach((r, idx) => {
          const teamMembers = r.payload || [];
          teamMembers.forEach(m => {
            if (!memberMap[m.id]) memberMap[m.id] = m;
          });
        });
        setAllMembers(Object.values(memberMap));
      });
    }
  }, [teams, dispatch]);


  const ShowTypingIndicator = (indicator) =>{
    if(selectedChat.id == indicator.senderId){
      setTypingIndicator({
        isTyping: indicator.typing,
        sender: indicator.senderId
      })
    }else if(selectedChat.id == indicator.teamId){
      setTypingIndicator({
        isTyping: indicator.typing,
        sender: indicator.senderId
      })
    }else {
      setTypingIndicator({
        isTyping: false,
        sender: null
      })
    }
  }

  return (
    <div className='dashboardLayout'>
      <Navbar setIsSidebarCollapsed={setIsSidebarCollapsed} isCollapsed={isSidebarCollapsed} />
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`mainContentArea ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
          <div className="chatroom-unified-layout" style={{ width: '100%' }}>
            <aside className="chatroom-unified-list">
              <div className="chatroom-list-section">
                <h3>Teams</h3>
                {teams.map((team) => (
                  <button
                    key={team.id}
                    className={selectedChat.type === 'team' && selectedChat.id === team.id ? 'selected' : ''}
                    onClick={() => setSelectedChat({ type: 'team', id: team.id, name: team.name })}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
              <div className="chatroom-list-section">
                <h3>Members</h3>
                {allMembers.length === 0 ? (
                  <span className="empty">No members found</span>
                ) : (
                  allMembers.map((m) => {
                    if (m.id === getCurrentUserId()) {
                      return (
                        <button
                          key={m.id}
                          className={selectedChat.type === 'member' && selectedChat.id === m.id ? 'selected' : ''}
                          onClick={() => setSelectedChat({ type: 'member', id: m.id, name: m.fullName || m.name })}
                        >
                          {m.fullName || m.name} (You)
                        </button>
                      );
                    } else {
                      return (
                        <button
                          key={m.id}
                          className={selectedChat.type === 'member' && selectedChat.id === m.id ? 'selected' : ''}
                          onClick={() => setSelectedChat({ type: 'member', id: m.id, name: m.fullName || m.name })}
                        >
                          {m.fullName || m.name}
                        </button>
                      );
                    }
                    return null; // If the user ID matches, return null (nothing to render)
                  })
                )}
              </div>
            </aside>
            <main className="chatroom-unified-chat">
              {selectedChat.type === 'team' ? (
                <>
                  <div className="chatroom-header">
                    <div className="chatroom-header-info">
                      <div className="chatroom-header-avatar">
                        <span className="chatroom-header-avatar-circle">
                          <BackgroundLetterAvatars
                            name={selectedChat.name}
                          />
                        </span>
                      </div>
                      <div className="chatroom-header-name">{selectedChat.name}</div>
                    </div>
                    <div className="chat-status-bar">
                      {typingIndicator.isTyping&&<span className="chat-typing">
                        <span className="typing-animation">
                          <span>.</span><span>.</span><span>.</span>
                        </span> typing
                      </span>}
                    </div>
                  </div>
                  <ChatRoom
                    userId={getCurrentUserId()}
                    teamId={selectedChat.id}
                    type="TEAM"
                    ShowTypingIndicator = {ShowTypingIndicator}
                  />
                </>
              ) : selectedChat.type === 'member' ? (
                <>
                  <div className="chatroom-header">
                    <div className="chatroom-header-info">
                      <div className="chatroom-header-avatar">
                        <span className="chatroom-header-avatar-circle">
                          <BackgroundLetterAvatars
                            name={selectedChat.name}
                          />
                        </span>
                      </div>
                      <div className="chatroom-header-name">{selectedChat.name}</div>
                    </div>
                    <div className="chat-status-bar">
                      <span className="chat-status-online">Online</span>
                      {typingIndicator.isTyping&&<span className="chat-typing">
                        <span className="typing-animation">
                          <span>.</span><span>.</span><span>.</span>
                        </span> typing
                      </span>}
                    </div>
                  </div>
                  <ChatRoom
                    userId={getCurrentUserId()}
                    directTo={selectedChat.id}
                    type="DIRECT"
                    ShowTypingIndicator = {ShowTypingIndicator}
                  />
                </>
              ) : (
                <div className="empty">Select a team or member to start chatting</div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChatPage;
