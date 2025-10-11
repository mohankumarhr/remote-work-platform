import { createSlice } from "@reduxjs/toolkit";
import { fetchCreatedTeams, deleteTeam } from "../../API/teamAPI";

const GetCreatedTeams = createSlice({
    name: "GetCreatedTeamsSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Fetch created teams
            .addCase(fetchCreatedTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreatedTeams.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchCreatedTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete team
            .addCase(deleteTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTeam.fulfilled, (state, action) => {
                const { teamId } = action.payload;
                state.value = state.value.filter(team => team.id !== teamId);
                state.loading = false;
            })
            .addCase(deleteTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default GetCreatedTeams.reducer