import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { orderBurgerThunk } from './actions';

/**
 * Интерфейс состояния заказа
 * @property order - данные текущего заказа (null если заказ не оформлен)
 * @property isOrderLoading - флаг процесса оформления заказа
 * @property hasError - сообщение об ошибке (null если ошибок нет)
 */
export interface IOrderState {
  order: TOrder | null;
  isOrderLoading: boolean;
  hasError: string | null;
}

/**
 * Начальное состояние:
 * - заказ не оформлен (order = null)
 * - нет активной загрузки (isOrderLoading = false)
 * - нет ошибок (hasError = null)
 */
const initialState: IOrderState = {
  order: null,
  isOrderLoading: false,
  hasError: null
};

/**
 * Слайс для управления состоянием заказов
 */
const orderSlice = createSlice({
  name: 'order', // Уникальное имя слайса
  initialState, // Начальное состояние

  // Синхронные редьюсеры
  reducers: {
    /**
     * Очистка данных о заказе
     * Сбрасывает состояние к начальному
     */
    clearOrder: (state) => {
      state.order = null;
      state.isOrderLoading = false;
      state.hasError = null;
    }
  },

  // Обработка асинхронных действий (thunk)
  extraReducers(builder) {
    builder
      // Начало оформления заказа
      .addCase(orderBurgerThunk.pending, (state) => {
        state.isOrderLoading = true;
        state.hasError = null; // Сбрасываем предыдущие ошибки
      })

      // Ошибка оформления
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        // Сохраняем сообщение об ошибке или стандартное сообщение
        state.hasError = action.error.message || 'Произошла ошибка';
      })

      // Успешное оформление
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        // Сохраняем данные о заказе из ответа сервера
        state.order = action.payload.order;
      });
  },

  // Селекторы для доступа к данным
  selectors: {
    /**
     * Получение статуса загрузки
     */
    isOrderLoadingSelector: (state) => state.isOrderLoading,

    /**
     * Получение данных о текущем заказе
     */
    orderSelector: (state) => state.order
  }
});

export const { clearOrder } = orderSlice.actions;

export const { isOrderLoadingSelector, orderSelector } = orderSlice.selectors;

export default orderSlice.reducer;
