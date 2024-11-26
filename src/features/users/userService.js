import axios from "axios";

// Replace with your MockAPI URL
const API_URL = "https://67458c3a512ddbd807f88179.mockapi.io/users";


// Create a new user
const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};


// Get all users
const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update a user
const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/${id}`, userData);
  return response.data;
};

// Delete a user
const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const userService = { createUser, getUsers, updateUser, deleteUser };

export default userService;
