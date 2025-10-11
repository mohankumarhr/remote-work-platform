import { createSlice } from "@reduxjs/toolkit";
import { fetchCreatedProjects, deleteProject, updateProject } from "../../API/ProjectAPI";

const GetCreatedProjects = createSlice({
    name: "GetCreatedProjectsSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Fetch created projects
            .addCase(fetchCreatedProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreatedProjects.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchCreatedProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete project
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                const { projectId } = action.payload;
                state.value = state.value.filter(project => project.id !== projectId);
                state.loading = false;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update project
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const updatedProject = action.payload;
                const index = state.value.findIndex(project => project.id === updatedProject.id);
                if (index !== -1) {
                    state.value[index] = updatedProject;
                }
                state.loading = false;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default GetCreatedProjects.reducer