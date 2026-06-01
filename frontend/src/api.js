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
