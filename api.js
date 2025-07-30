// src/services/api.js
import axios from 'axios';

const API_BASE = 'https://cse216-project.onrender.com';

// Fetch all shows
export const fetchShows = () => axios.get(`${API_BASE}/shows`);

// (Optional) Fetch all users
export const fetchUsers = () => axios.get(`${API_BASE}/users`);

// (Optional) Add a new user
export const addUser = (userData) => axios.post(`${API_BASE}/users`, userData);

// You can add more endpoints like:
// export const fetchCategories = () => axios.get(`${API_BASE}/categories`);
