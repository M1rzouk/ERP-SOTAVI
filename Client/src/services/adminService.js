// src/services/adminService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Récupérer tous les utilisateurs
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du chargement des utilisateurs');
    }
    return data.users || [];
  } catch (error) {
    console.error('❌ Erreur getUsers:', error);
    throw error;
  }
};

// Récupérer les rôles
export const getRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/roles`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du chargement des rôles');
    }
    return data.roles || [];
  } catch (error) {
    console.error('❌ Erreur getRoles:', error);
    throw error;
  }
};

// Créer un utilisateur
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création');
    }
    return data.employee;
  } catch (error) {
    console.error('❌ Erreur createUser:', error);
    throw error;
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour');
    }
    return data.employee;
  } catch (error) {
    console.error('❌ Erreur updateUser:', error);
    throw error;
  }
};

// Désactiver un utilisateur
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la désactivation');
    }
    return data;
  } catch (error) {
    console.error('❌ Erreur deleteUser:', error);
    throw error;
  }
};

export default {
  getRoles,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};