import { createSlice } from "@reduxjs/toolkit";
import { fetchAllTasks } from "../../API/taskAPI";

const GetAllTaskSlice = createSlice({
    name: "GetAllTaskSlice",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default GetAllTaskSlice.reducer