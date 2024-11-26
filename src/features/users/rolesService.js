import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const ROLES_API_URL = "https://67458c3a512ddbd807f88179.mockapi.io/roles";

// Fetch roles
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (_, thunkAPI) => {
  try {
    const response = await axios.get(ROLES_API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch roles");
  }
});

// Add a role
export const addRole = createAsyncThunk("roles/addRole", async (roles, thunkAPI) => {
  try {
    const response = await axios.post(ROLES_API_URL, roles );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to add role");
  }
});

// Edit a role
export const editRole = createAsyncThunk(
    "roles/editRole", 
    async ({ id, roles }, thunkAPI) => { // Destructuring id and roles from the payload
      try {
        const response = await axios.put(`${ROLES_API_URL}/${id}`, roles); // Send the correct data structure
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to edit role");
      }
    }
  );
  

// Delete a role
export const deleteRole = createAsyncThunk("roles/deleteRole", async (id, thunkAPI) => {
  try {
    await axios.delete(`${ROLES_API_URL}/${id}`);
    return id; // Return the ID of the deleted role
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete role");
  }
});

// Create the slice
const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Role
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      // Edit Role
      .addCase(editRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      // Delete Role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload);
      });
  },
});

export default rolesSlice.reducer;
