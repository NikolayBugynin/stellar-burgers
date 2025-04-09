import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';

/**
 * Асинхронный Thunk для загрузки списка ингредиентов
 *
 * @description
 * 1. Создает асинхронное действие для Redux, которое:
 *    - Автоматически обрабатывает состояния pending/fulfilled/rejected
 *    - Интегрируется с Redux Toolkit's createSlice
 *
 * 2. При вызове диспетчеризует три типа действий:
 *    - ingredients/getIngredients/pending (начало загрузки)
 *    - ingredients/getIngredients/fulfilled (успешная загрузка)
 *    - ingredients/getIngredients/rejected (ошибка загрузки)
 *
 * 3. Использует API-функцию getIngredientsApi для получения данных с сервера
 */
export const getIngredientsThunk = createAsyncThunk(
  // Уникальный тип действия (используется для генерации action types)
  'ingredients/getIngredients',

  // Асинхронная функция-исполнитель
  async () => {
    try {
      // Вызываем API-функцию и возвращаем результат
      return await getIngredientsApi();
    } catch (error) {
      // Ошибки автоматически обрабатываются Redux Toolkit
      // и попадают в rejected-кейс
      throw error;
    }
  }
);
