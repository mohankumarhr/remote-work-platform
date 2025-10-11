import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const userSericeUrl = "http://localhost:8082"

export const fetchUserDetails = createAsyncThunk(
    'teams/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(userSericeUrl + '/userprofile/get', {
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

export const UpdateUserDetails = createAsyncThunk(
    'teams/UpdateUserDetails',
    async ({ details, id}, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${userSericeUrl}/userprofile/update`,
                details,
                {   params: {
                        id: id
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