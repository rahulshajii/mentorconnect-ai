import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Persistent Login Check on Mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        setUser(data.user);
        setProfile(data.profile);
      } catch (err) {
        console.error('Persistent token verification failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const loginUser = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      toast.success('Welcome back to MentorConnect AI!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
      throw err;
    }
  };

  const registerUser = async (userData) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      toast.success('Account created successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(msg);
      throw err;
    }
  };

  const updateUserProfile = async (updateData) => {
    try {
      const data = await profileService.updateProfile(updateData);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      setProfile(data.profile);
      toast.success('Profile updated successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setProfile(null);
    toast.success('Signed out safely');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login: loginUser,
        register: registerUser,
        updateProfile: updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
