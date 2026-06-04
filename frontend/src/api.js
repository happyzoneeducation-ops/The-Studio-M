import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const getProjects = async () => {
  const { data } = await axios.get(`${API}/projects`);
  return data;
};

export const getProject = async (id) => {
  const { data } = await axios.get(`${API}/projects/${id}`);
  return data;
};

export const createEnquiry = async (payload) => {
  const { data } = await axios.post(`${API}/enquiries`, payload);
  return data;
};

// ---------- Admin ----------
const TOKEN_KEY = "sm_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const adminLogin = async (username, password) => {
  const { data } = await axios.post(`${API}/admin/login`, { username, password });
  setToken(data.token);
  return data;
};

export const getAdminEnquiries = async () => {
  const { data } = await axios.get(`${API}/admin/enquiries`, authHeader());
  return data;
};

export const getAdminStats = async () => {
  const { data } = await axios.get(`${API}/admin/stats`, authHeader());
  return data;
};

export const markEnquiryRead = async (id) => {
  const { data } = await axios.patch(`${API}/admin/enquiries/${id}`, {}, authHeader());
  return data;
};

export const deleteEnquiry = async (id) => {
  const { data } = await axios.delete(`${API}/admin/enquiries/${id}`, authHeader());
  return data;
};
