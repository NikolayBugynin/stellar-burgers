import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../../utils/burger-api';

/**
 * Асинхронный thunk для получения списка всех заказов.
 * Использует API-функцию getFeedsApi для выполнения запроса.
 *
 * При создании thunk автоматически генерируются три состояния:
 * - pending (начало загрузки)
 * - fulfilled (успешное выполнение)
 * - rejected (ошибка)
 *
 * Эти состояния обрабатываются в редьюсере feedSlice.
 */
export const getFeedsThunk = createAsyncThunk(
  'feeds/getFeeds', // Уникальное имя для этого thunk-действия
  getFeedsApi // Функция API, которая будет вызвана для получения данных
);

/**
 * Асинхронный thunk для получения конкретного заказа по его номеру.
 * Использует API-функцию getOrderByNumberApi для выполнения запроса.
 *
 * Автоматически генерирует те же три состояния:
 * - pending (начало загрузки)
 * - fulfilled (успешное выполнение)
 * - rejected (ошибка)
 *
 * Обрабатывается в редьюсере feedSlice.
 */
export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrder', // Уникальное имя для этого thunk-действия
  getOrderByNumberApi // Функция API, которая будет вызвана для получения данных
);
