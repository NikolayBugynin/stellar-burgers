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
} from '../../../utils/burger-api';

import { deleteCookie, setCookie } from '../../../utils/cookie';

/**
 * Thunk для авторизации пользователя
 * При успешном входе:
 * 1. Устанавливает accessToken в cookie
 * 2. Сохраняет refreshToken в localStorage
 * 3. Возвращает данные пользователя
 */
export const loginUserThunk = createAsyncThunk(
  'users/loginUser', // Уникальное имя действия для Redux
  async (data: TLoginData) =>
    loginUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

/**
 * Thunk для выхода пользователя
 * При выходе:
 * 1. Удаляет accessToken из cookie
 * 2. Удаляет refreshToken из localStorage
 */
export const logoutUserThunk = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

/**
 * Thunk для получения данных текущего пользователя
 * Добавлено логирование для отладки
 */
export const getUserThunk = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  console.log('Пользователь загружен:', response); // Отладочная информация
  return response;
});

/**
 * Thunk для регистрации нового пользователя
 * При успешной регистрации:
 * 1. Устанавливает accessToken в cookie
 * 2. Сохраняет refreshToken в localStorage
 * 3. Возвращает данные пользователя
 */
export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData) =>
    registerUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

/**
 * Thunk для обновления данных пользователя
 * Принимает частичные данные для обновления (Partial<TRegisterData>)
 */
export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

/**
 * Thunk для получения заказов пользователя
 */
export const getOrdersThunk = createAsyncThunk(
  'users/getUserOrders',
  async () => getOrdersApi()
);
