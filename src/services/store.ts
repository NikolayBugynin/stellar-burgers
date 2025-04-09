import { configureStore, combineReducers } from '@reduxjs/toolkit';

import burgerConstructor from './slices/burger-constructor/slice'; // Слайс для конструктора бургера
import feed from './slices/feed/slice'; // Слайс для ленты заказов
import ingredients from './slices/ingredients/slice'; // Слайс для ингредиентов
import order from './slices/order/slice'; // Слайс для заказа
import user from './slices/user/slice'; // Слайс для пользователя

// Импорт типизированных хуков из React-Redux
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объединение всех редьюсеров в корневой редьюсер
export const rootReducer = combineReducers({
  burgerConstructor, // Состояние конструктора бургеров
  feed, // Состояние ленты заказов
  ingredients, // Состояние ингредиентов
  order, // Состояние текущего заказа
  user // Состояние пользователя
});

// Создание хранилища Redux с объединенным редьюсером
const store = configureStore({
  reducer: rootReducer // Передаем корневой редьюсер
  // Redux Toolkit автоматически добавляет:
  // - redux-thunk middleware
  // - DevTools расширение
  // - Проверку на мутацию состояния
});

// Тип для всего состояния приложения
export type RootState = ReturnType<typeof rootReducer>;

// Тип для dispatch с учетом middleware
export type AppDispatch = typeof store.dispatch;

// Создание типизированных хуков для использования в компонентах

// Хук для dispatch с правильной типизацией
export const useDispatch: () => AppDispatch = dispatchHook;

// Хук для selector с правильной типизацией
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
