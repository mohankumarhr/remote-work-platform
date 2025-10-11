import { createSlice } from "@reduxjs/toolkit";
import { fetchChatByReceiver, fetchTeamChat } from "../../API/messagesAPI";

// const GetAllChats = createSlice({
//     name: "GetAllChats",
//     initialState: {
//         value: [],
//         loading: false,
//         error: ""
//     },
//     reducers: {

//     },
//     extraReducers: (builder) => {
//         builder
//             // Fetch created projects
//             .addCase(fetchChatByReceiver.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchChatByReceiver.fulfilled, (state, action) => {
//                 state.value = action.payload;
//                 state.loading = false;
//             })
//             .addCase(fetchChatByReceiver.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })
//     }
// })

// export default GetAllChats.reducer

// chatSlice.js

const chatSlice = createSlice({
  name: "chat",
  initialState: { value: [] },
  reducers: {
    addMessage: (state, action) => {
      state.value.push(action.payload); // append new message
    },
    clearMessages: (state) => {
      state.value = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatByReceiver.fulfilled, (state, action) => {
      state.value = action.payload; // load direct chat history
    });
    builder.addCase(fetchTeamChat.fulfilled, (state, action) => {
      state.value = action.payload; // load team chat history
    });
  }
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
