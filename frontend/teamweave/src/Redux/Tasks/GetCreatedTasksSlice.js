import { createSlice } from "@reduxjs/toolkit";
import { createTask, fetchCreatedTasks, updateTaskStatus, deleteTask } from "../../API/taskAPI";

const GetCreatedTasks = createSlice({
    name: "GetCreatedTasksSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.value.push(action.payload);
                state.loading = false;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch created tasks
            .addCase(fetchCreatedTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreatedTasks.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchCreatedTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update task status
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const { taskId, newStatus } = action.payload;
                const task = state.value.find(task => task.id === taskId);
                if (task) {
                    task.status = newStatus;
                }
                state.loading = false;
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const { taskId } = action.payload;
                state.value = state.value.filter(task => task.id !== taskId);
                state.loading = false;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default GetCreatedTasks.reducer