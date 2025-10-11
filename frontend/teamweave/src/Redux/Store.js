import { configureStore } from '@reduxjs/toolkit';
import GetAllTaskReducer from '../Redux/Tasks/GetAllTaskSlice'
import GetAssignedTaskReducer from '../Redux/Tasks/GetAssignedTaskSlice'
import GetMemberedTeamReducer from '../Redux/Teams/GetTeamsByMemberSlice'
import GetTeamMembersReducer from '../Redux/Teams/GetTeamMembersSlice'
import GetProjectReducer from '../Redux/Projects/GetProjectByTeamSlice'
import GetCreatedTeamsReducer from '../Redux/Teams/GetCreatedTeamsSlice'
import GetCreatedProjectsReducer from '../Redux/Projects/GetCreatedProjectsSlice'
import GetCreatedTasksReducer from '../Redux/Tasks/GetCreatedTasksSlice'
import GetAllMessagesReducer from './Chat/chatSlice'
import GetUserDetailsReducer from './Profile/GetUserSlice'

const store = configureStore({
  reducer: {
    getAllTask: GetAllTaskReducer,
    getAssignedTask : GetAssignedTaskReducer,
    getMemberedTeam :  GetMemberedTeamReducer,
    getTeamMembers : GetTeamMembersReducer,
    getProject : GetProjectReducer,
    getCreatedTeams : GetCreatedTeamsReducer,
    getCreatedProjects : GetCreatedProjectsReducer,
    getCreatedTasks : GetCreatedTasksReducer,
    getAllMessages: GetAllMessagesReducer,
    getUserDetails : GetUserDetailsReducer
  }
});

export default store;