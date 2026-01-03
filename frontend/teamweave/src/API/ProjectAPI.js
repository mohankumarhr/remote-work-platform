import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// const taskSericeUrl = "http://localhost:8084"

const taskSericeUrl = "https://task-service-ewiw.onrender.com"

export const fetchProjectByTeam = createAsyncThunk(
    'projects/fetchProjectByTeam',
    async (teamId, { rejectWithValue }) => {
        try {
            const response = await axios.get(taskSericeUrl + '/project/by-team', {
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
                error.response?.data?.message || error.message || 'Failed to fetch project'
            )
        }
    }
)


export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await axios.get(taskSericeUrl + '/project/get', {
                params: {
                    projectId
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch project'
            )
        }
    }
)


export const createProject = createAsyncThunk(
    'teams/createProject',
    async ({ name, description, subject, teamId, dueDate, ownerId}, { rejectWithValue }) => {
        console.log(name, description, subject, teamId, dueDate, ownerId)
        try {
            const response = await axios.post(
                taskSericeUrl + '/project/create',
                { name, description, subject, teamId, dueDate, ownerId },
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
                error.response?.data?.message || error.message || 'Failed to create project'
            )
        }
    }
)

// Fetch projects created by user
export const fetchCreatedProjects = createAsyncThunk(
    'projects/fetchCreatedProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(taskSericeUrl + '/project/by-owner', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch created projects'
            )
        }
    }
)

// Delete project
export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${taskSericeUrl}/project/delete`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
                params: { projectId } // <-- send projectId as query param
            });

            return { projectId, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to delete project'
            );
        }
    }
);


// Update project
export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ projectId, name, description, subject, teamId, dueDate, ownerId }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${taskSericeUrl}/project/update`,
                { name, description, subject, teamId, dueDate, ownerId },
                {
                    params: {
                        projectId: projectId
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
                error.response?.data?.message || error.message || 'Failed to update project'
            )
        }
    }
)