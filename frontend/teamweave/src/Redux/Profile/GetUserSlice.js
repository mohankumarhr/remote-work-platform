import { createSlice } from "@reduxjs/toolkit";
import { fetchUserDetails, UpdateUserDetails } from "../../API/UserAPI";

const GetUserDetails = createSlice({
    name: "GetUserDetails",
    initialState: {
        value: [],
        loading: false,
        error: ""
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //update user
            .addCase(UpdateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateUserDetails.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loading = false;
            })
            .addCase(UpdateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
})

export default GetUserDetails.reducer