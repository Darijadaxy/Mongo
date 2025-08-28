import { getAuthHeaders } from "../utils/authHeaders";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const logInUser = async (loginInfo) => {
  const response = await fetch(`${API_BASE_URL}/User/logInUser/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginInfo),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.text();
};

export const registerUser = async (registerInfo) => {
  const response = await fetch(`${API_BASE_URL}/User/registerUser/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerInfo),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.text();
};

export const getLoggedInUser = async () => {
  const token = sessionStorage.getItem('jwt');
  if (!token) throw new Error('Token nije pronađen');

  const response = await fetch(`${API_BASE_URL}/User/getLoggedInUser`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    sessionStorage.removeItem('jwt');
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};