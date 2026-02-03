import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

export const register = (data) =>
    axios.post(`${API_URL}/register`, data);

export const login = (data) =>
    axios.post(`${API_URL}/login`, data);
