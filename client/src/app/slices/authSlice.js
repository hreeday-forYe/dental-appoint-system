import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
    },

    logout(state) {
      // state.user
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
