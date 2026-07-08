// src/core/services/authService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const login = async (matricule, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricule, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Matricule ou mot de passe incorrect');
    }
    
    // Stocker le token
    localStorage.setItem('token', data.token);
    
    // Stocker l'utilisateur avec ses permissions
    const userData = {
      id: data.employee.id,
      matricule: data.employee.matricule,
      name: data.employee.full_name,
      username: data.employee.username,
      email: data.employee.email,
      pdp: data.employee.pdp,
      role: data.roles && data.roles.length > 0 ? data.roles[0] : 'User',
      permissions: data.employee.permissions || [],
      roles: data.roles || []
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('❌ Erreur login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    }
  } catch (error) {
    console.error('❌ Erreur logout:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('❌ Erreur getCurrentUser:', error);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token') && !!localStorage.getItem('user');
};