import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { getFeedsThunk, getOrderByNumberThunk } from './actions';

export interface FeedState {
  orders: TOrder[];
  isFeedsLoading: boolean;
  order: TOrder | null;
  isOrderLoading: boolean;
  total: number;
  totalToday: number;
  error: string | null;
}

/**
 * Начальное состояние хранилища ленты заказов
 */
export const initialState: FeedState = {
  orders: [],
  isFeedsLoading: false,
  order: null,
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    /**
     * Селектор для получения списка всех заказов
     */
    ordersSelector: (state) => state.orders,

    /**
     * Селектор для получения статуса загрузки списка заказов
     */
    isFeedsLoadingSelector: (state) => state.isFeedsLoading,

    /**
     * Селектор для получения текущего заказа
     */
    orderSelector: (state) => state.order,

    /**
     * Селектор для получения статуса загрузки деталей заказа
     */
    isOrderLoadingSelector: (state) => state.isOrderLoading,

    /**
     * Селектор для получения общего количества заказов
     */
    totalSelector: (state) => state.total,

    /**
     * Селектор для получения количества заказов за сегодня
     */
    totalTodaySelector: (state) => state.totalToday
  },
  reducers: {}, // Обычные редьюсеры не используются
  extraReducers(builder) {
    builder
      // Обработка состояний загрузки списка заказов
      .addCase(getFeedsThunk.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке ленты заказов';
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      // Обработка состояний загрузки конкретного заказа
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказа';
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        // API возвращает массив с одним заказом, берем первый элемент
        state.order = action.payload.orders[0];
      });
  }
});

// Экспорт всех селекторов
export const {
  ordersSelector,
  isFeedsLoadingSelector,
  orderSelector,
  isOrderLoadingSelector,
  totalSelector,
  totalTodaySelector
} = feedSlice.selectors;

export default feedSlice.reducer;
