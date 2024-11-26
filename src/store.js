import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";
import rolesReducer from "./features/users/rolesService";

const store = configureStore({
  reducer: {
    users: userReducer,
    roles: rolesReducer,
  },
});

export default store;
