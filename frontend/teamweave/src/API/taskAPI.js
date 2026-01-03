import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// Async thunk to fetch all tasks


// const taskServiceUrl = "http://localhost:8084"

const taskServiceUrl = "https://task-service-ewiw.onrender.com"

export const fetchAllTasks = createAsyncThunk(
    'tasks/fetchAllTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(taskServiceUrl + '/task/all', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch tasks'
            )
        }
    }
)


export const fetchAssignedTasks = createAsyncThunk(
    'tasks/fetchAssignedTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(taskServiceUrl + '/task/by-assigned-user', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch tasks'
            )
        }
    }
)

// Update task status
export const updateTaskStatus = createAsyncThunk(
    'tasks/updateTaskStatus',
    async ({ taskId, status }, { rejectWithValue }) => {
        try {
            console.log(taskId, status)
            const response = await axios.post(`${taskServiceUrl}/task/update-status`, {}, {
                params: {
                    taskId: taskId,
                    status: status
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to update task'
            )
        }
    }
)


// Update entire task
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskId, taskData }, { rejectWithValue }) => {
        try {
            console.log(taskData)
            const response = await axios.post(
                `${taskServiceUrl}/task/update`,
                taskData,
                {   params: {
                        taskId: taskId
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
                error.response?.data?.message || error.message || 'Failed to update task'
            )
        }
    }
)

// Create new task
export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${taskServiceUrl}/task/create`,
                taskData,
                {
                    params: {
                        projectId : taskData.projectId
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
                error.response?.data?.message || error.message || 'Failed to create task'
            )
        }
    }
)

// Fetch tasks created by user
export const fetchCreatedTasks = createAsyncThunk(
    'tasks/fetchCreatedTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(taskServiceUrl + '/task/by-owner', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch created tasks'
            )
        }
    }
)

// Delete task
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${taskServiceUrl}/task/delete`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
                params: { taskId }  // <-- send taskId as query param
            });

            return { taskId, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to delete task'
            );
        }
    }
);



