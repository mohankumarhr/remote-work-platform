import { createSlice } from "@reduxjs/toolkit";
import { fetchAssignedTasks, updateTaskStatus, updateTask, createTask } from "../../API/taskAPI";

const GetAssignedTask = createSlice({
    name: "GetAssignedTaskSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Fetch assigned tasks
            .addCase(fetchAssignedTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssignedTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update task status
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const { taskId, status } = action.payload;
                const taskIndex = state.value.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    state.value[taskIndex].status = status;
                }
                state.loading = false;
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update entire task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const taskIndex = state.value.findIndex(task => task.id === updatedTask.id);
                if (taskIndex !== -1) {
                    state.value[taskIndex] = updatedTask;
                }
                state.loading = false;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
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
            });
    }
})

export default GetAssignedTask.reducer