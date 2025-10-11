import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const teamSericeUrl = "http://localhost:8083";

export const addMemberToTeam = createAsyncThunk(
  'teams/addMemberToTeam',
  async ({ teamId, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${teamSericeUrl}/team/addmember`,
        {},
        {   
          params: {
            username: username,
            teamId: teamId
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get("jwtToken")}`
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add member'
      );
    }
  }
);

export const removeMemberFromTeam = createAsyncThunk(
  'teams/removeMemberFromTeam',
  async ({ teamId, memberId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${teamSericeUrl}/team/removemember`,
        {},
        {   
          params: {
            teamId: teamId,
            userId: memberId
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get("jwtToken")}`
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to remove member'
      );
    }
  }
);
