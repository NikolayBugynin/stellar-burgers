import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '../../../utils/types';
import {
  getOrdersThunk,
  getUserThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserThunk
} from './actions';

// Интерфейс состояния пользователя
export interface IUserState {
  isAuthenticated: boolean; // Флаг авторизации пользователя
  loginUserRequest: boolean; // Флаг выполнения запроса авторизации
  user: TUser | null; // Данные пользователя или null если не авторизован
  orders: TOrder[]; // Массив заказов пользователя
  ordersRequest: boolean; // Флаг выполнения запроса заказов
  error: string | null; // Сообщение об ошибке или null
}

// Начальное состояние слайса
const initialState: IUserState = {
  isAuthenticated: false,
  loginUserRequest: false,
  user: null,
  orders: [],
  ordersRequest: false,
  error: null
};

// Создание слайса пользователя
const userSlice = createSlice({
  name: 'user', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Редьюсер для очистки ошибок
    clearErrors: (state) => {
      state.error = null;
    }
  },
  // Обработка асинхронных действий (thunk)
  extraReducers(builder) {
    builder
      // Обработка состояний для авторизации пользователя
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true; // Запрос начался
        state.error = null; // Очищаем предыдущие ошибки
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false; // Запрос завершен
        state.error = action.error.message!; // Сохраняем ошибку
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload; // Сохраняем данные пользователя
        state.loginUserRequest = false; // Запрос завершен
        state.isAuthenticated = true; // Устанавливаем флаг авторизации
      })

      // Обработка выхода пользователя
      .addCase(logoutUserThunk.pending, (state) => {
        state.user = null; // Очищаем данные пользователя
        state.loginUserRequest = false; // Сбрасываем флаг запроса
        state.isAuthenticated = false; // Сбрасываем флаг авторизации
      })

      // Обработка получения данных пользователя
      .addCase(getUserThunk.pending, (state) => {
        state.loginUserRequest = true; // Запрос начался
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.user = null; // Очищаем данные пользователя
        state.loginUserRequest = false; // Запрос завершен
        state.error = action.error.message!; // Сохраняем ошибку
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user; // Сохраняем данные пользователя
        state.loginUserRequest = false; // Запрос завершен
        state.isAuthenticated = true; // Устанавливаем флаг авторизации
      })

      // Обработка регистрации пользователя
      .addCase(registerUserThunk.pending, (state) => {
        state.isAuthenticated = false; // Сбрасываем флаг авторизации
        state.loginUserRequest = true; // Запрос начался
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isAuthenticated = false; // Остаемся неавторизованными
        state.loginUserRequest = false; // Запрос завершен
        state.error = action.error.message!; // Сохраняем ошибку
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload; // Сохраняем данные пользователя
        state.loginUserRequest = false; // Запрос завершен
        state.isAuthenticated = true; // Устанавливаем флаг авторизации
      })

      // Обработка обновления данных пользователя
      .addCase(updateUserThunk.pending, (state) => {
        state.loginUserRequest = true; // Запрос начался
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false; // Запрос завершен
        state.error = action.error.message!; // Сохраняем ошибку
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user; // Обновляем данные пользователя
        state.loginUserRequest = false; // Запрос завершен
        state.isAuthenticated = true; // Подтверждаем авторизацию
      })

      // Обработка получения заказов пользователя
      .addCase(getOrdersThunk.pending, (state) => {
        state.ordersRequest = true; // Запрос начался
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.error = action.error.message!; // Сохраняем ошибку
        state.ordersRequest = false; // Запрос завершен
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload; // Сохраняем полученные заказы
        state.ordersRequest = false; // Запрос завершен
      });
  },
  // Селекторы для удобного доступа к данным состояния
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthenticated, // Флаг авторизации
    loginUserRequestSelector: (state) => state.loginUserRequest, // Статус запроса
    userNameSelector: (state) => state.user?.name || '', // Имя пользователя
    userEmailSelector: (state) => state.user?.email || '', // Email пользователя
    userSelector: (state) => state.user, // Все данные пользователя
    userOrdersSelector: (state) => state.orders, // Заказы пользователя
    ordersRequestSelector: (state) => state.orders, // Повторное использование?
    errorSelector: (state) => state.error // Ошибки
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isAuthCheckedSelector,
  userNameSelector,
  userEmailSelector,
  userSelector,
  loginUserRequestSelector,
  userOrdersSelector,
  ordersRequestSelector,
  errorSelector
} = userSlice.selectors;

export default userSlice.reducer;
