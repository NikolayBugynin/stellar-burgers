import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';

/**
 * Authentication Thunks
 * Contains all async actions for user authentication and profile management
 */

// User login with credentials
export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials: TLoginData) => {
    const { accessToken, refreshToken, user } = await loginUserApi(credentials);

    // Store tokens
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return user;
  }
);

// User logout - clears authentication tokens
export const logoutUserThunk = createAsyncThunk('auth/logout', async () => {
  await logoutApi(); // Server-side session cleanup

  // Remove client-side tokens
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Fetch current user profile
export const getUserThunk = createAsyncThunk('user/profile', async () => {
  const { user } = await getUserApi();
  return user;
});

// Register new user account
export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (registrationData: TRegisterData) => {
    const { accessToken, refreshToken, user } =
      await registerUserApi(registrationData);

    // Store tokens upon successful registration
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return user;
  }
);

// Update user profile information
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (updateData: Partial<TRegisterData>) => updateUserApi(updateData)
);

// Fetch user's order history
export const getOrdersThunk = createAsyncThunk(
  'orders/getUserOrders',
  async () => getOrdersApi()
);
