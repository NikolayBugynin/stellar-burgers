import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';
import { getIngredientsThunk } from './actions';

/**
 * Интерфейс состояния хранилища ингредиентов
 * @property ingredients - массив всех доступных ингредиентов
 * @property isIngredientsLoading - флаг загрузки данных
 * @property error - сообщение об ошибке (если есть)
 */
export interface IngredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

/**
 * Начальное состояние хранилища ингредиентов
 * - ingredients: пустой массив (данные еще не загружены)
 * - isIngredientsLoading: false (загрузка не выполняется)
 * - error: null (ошибок нет)
 */
const initialState: IngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

/**
 * Слайс для управления состоянием ингредиентов
 */
const ingredientsSlice = createSlice({
  name: 'ingredients', // Уникальное имя слайса
  initialState, // Начальное состояние

  // Селекторы для доступа к данным
  selectors: {
    /**
     * Селектор для получения массива ингредиентов
     */
    ingredientsSelector: (state) => state.ingredients,

    /**
     * Селектор для получения статуса загрузки
     */
    isIngredientsLoadingSelector: (state) => state.isIngredientsLoading
  },

  // Синхронные редьюсеры (не используются в этом слайсе)
  reducers: {},

  // Обработка асинхронных действий (thunk)
  extraReducers(builder) {
    builder
      // Обработка начала загрузки ингредиентов
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null; // Сбрасываем ошибку при новом запросе
      })

      // Обработка ошибки загрузки
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      })

      // Обработка успешной загрузки
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload; // Сохраняем полученные данные
      });
  }
});

export const { ingredientsSelector, isIngredientsLoadingSelector } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
