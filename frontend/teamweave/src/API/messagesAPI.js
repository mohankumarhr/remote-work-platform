import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const chatSericeUrl = "http://localhost:8085"

export const fetchTeamChat = createAsyncThunk(
    'chat/fetchTeamChat',
    async ({ teamId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(chatSericeUrl + `/api/chat/team`, {
                params: { teamId },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get("jwtToken")}`
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch team messages'
            );
        }
    }
);


export const fetchChatByReceiver = createAsyncThunk(
    'projects/fetchProjectByTeam',
    async ({senderId, receiverId}, { rejectWithValue }) => {

        try {
            const response = await axios.get(chatSericeUrl + '/api/chat/direct', {
                params: {
                    senderId: senderId,
                    receiverId: receiverId
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${Cookies.get("jwtToken")}`
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch messages'
            )
        }
    }
)