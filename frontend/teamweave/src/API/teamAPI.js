import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'


// const teamSericeUrl = "http://localhost:8083"

const teamSericeUrl = "https://team-service-ec7y.onrender.com"

export const fetchTeamsByUser = createAsyncThunk(
    'teams/fetchTeamsByUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(teamSericeUrl + '/team/bymember', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch teams'
            )
        }
    }
)


export const fetchTeamMember = createAsyncThunk(
    'teams/fetchTeamMember',
    async (teamId, { rejectWithValue }) => {
        try {
            const response = await axios.get(teamSericeUrl + '/team/members', {
                params: {
                    teamId
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch members'
            )
        }
    }
)

export const createTeam = createAsyncThunk(
    'teams/createTeam',
    async ({ name, ownerId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                teamSericeUrl + '/team/create',
                { name, ownerId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get("jwtToken")}`
                    },
                }
            )

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to create team'
            )
        }
    }
)

// Fetch teams created by user
export const fetchCreatedTeams = createAsyncThunk(
    'teams/fetchCreatedTeams',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(teamSericeUrl + '/team/byowner', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch created teams'
            )
        }
    }
)

// Delete team
export const deleteTeam = createAsyncThunk(
    'teams/deleteTeam',
    async (teamId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${teamSericeUrl}/team/delete`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
                params: { teamId } // <-- send teamId as query param
            });

            return { teamId, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to delete team'
            );
        }
    }
);


// Update team
export const updateTeam = createAsyncThunk(
    'teams/updateTeam',
    async ({ teamId, name}, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${teamSericeUrl}/team/update`,
                {},
                {   params: {
                        teamId: teamId,
                        newName: name
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get("jwtToken")}`
                    },
                }
            )
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to update team'
            )
        }
    }
)

