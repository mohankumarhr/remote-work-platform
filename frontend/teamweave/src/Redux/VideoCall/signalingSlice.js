import { createSlice } from "@reduxjs/toolkit";

const signalingSlice = createSlice({
  name: "signaling",
  initialState: {
    socket: null,
    connected: false,
    incomingOffer: null,
    // remove socket from here!
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setSocket: (state, action) => {
      // Storing non-serializable data like a socket in Redux is
      // generally discouraged, but it's the simplest way to share it.
      state.socket = action.payload;
    },
    // ✅ Add this reducer
    setIncomingOffer: (state, action) => {
      state.incomingOffer = action.payload;
    },
    // ✅ Add this reducer
    clearIncomingOffer: (state) => {
      state.incomingOffer = null;
    },
  },
});

export const { setConnected, setSocket, setIncomingOffer, clearIncomingOffer } = signalingSlice.actions;
export default signalingSlice.reducer;



// import { createSlice } from "@reduxjs/toolkit";

// const signalingSlice = createSlice({
//   name: "signaling",
//   initialState: {
//     socket: null,
//     connected: false,
//     incomingCall: null, // { from, offer }
//   },
//   reducers: {
//     setSocket: (state, action) => {
//       state.socket = action.payload;
//     },
//     setConnected: (state, action) => {
//       state.connected = action.payload;
//     },
//     setIncomingCall: (state, action) => {
//       state.incomingCall = action.payload;
//     },
//     clearIncomingCall: (state) => {
//       state.incomingCall = null;
//     },
//   },
// });

// export const { setSocket, setConnected, setIncomingCall, clearIncomingCall } = signalingSlice.actions;
// export default signalingSlice.reducer;
