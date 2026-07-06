// src/services/adminService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getRoles = async () => {
  const response = await fetch(`${API_URL}/admin/roles`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement des rôles');
  return data.roles;
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erreur lors de la création');
  return data.employee;
};