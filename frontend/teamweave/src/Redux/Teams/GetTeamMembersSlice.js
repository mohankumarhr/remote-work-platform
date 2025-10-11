import { createSlice } from "@reduxjs/toolkit";
import { fetchTeamMember } from "../../API/teamAPI";

const GetTeamMembers = createSlice({
    name: "GetTeamMembersSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeamMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamMember.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchTeamMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default GetTeamMembers.reducer