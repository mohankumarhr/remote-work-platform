import { createSlice } from "@reduxjs/toolkit";
import { fetchProjectByTeam, createProject } from "../../API/ProjectAPI";

const GetProject = createSlice({
    name: "GetProjectByTeamSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectByTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectByTeam.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjectByTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.value.push(action.payload);
                state.loading = false;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default GetProject.reducer