import { createSlice } from "@reduxjs/toolkit";
import { fetchTeamsByUser, createTeam, updateTeam } from "../../API/teamAPI";

const GetMemberedTeam = createSlice({
    name: "GetTeamsByMemberSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Fetch teams by user
            .addCase(fetchTeamsByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamsByUser.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchTeamsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create team
            .addCase(createTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.value.push(action.payload);
                state.loading = false;
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // update team
            .addCase(updateTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTeam.fulfilled, (state, action) => {
                state.value.push(action.payload);
                state.loading = false;
            })
            .addCase(updateTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
            
    }
})

export default GetMemberedTeam.reducer