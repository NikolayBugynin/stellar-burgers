import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';
import { v4 as uuidv4 } from 'uuid';

// Интерфейс для состояния конструктора бургеров
export interface burgerConstructorState {
  burgerConstructor: {
    bun: TConstructorIngredient | null; // Хранит текущую булку (может быть null)
    ingredients: TConstructorIngredient[]; // Массив ингредиентов бургера
  };
  error: string | null; // Для хранения ошибок, если они возникают
}

// Начальное состояние хранилища
const initialState: burgerConstructorState = {
  burgerConstructor: {
    bun: null, // Изначально булка не выбрана
    ingredients: [] // Изначально нет ингредиентов
  },
  error: null // Изначально ошибок нет
};

// Создание слайса (отдельной части хранилища) для конструктора бургеров
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    // Селектор для получения всего состояния конструктора
    burgerConstructorSelector: (state) => state.burgerConstructor
  },
  reducers: {
    // Редьюсер для добавления ингредиента
    addIngredient: {
      // Основная функция-редьюсер
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          // Если ингредиент - булка, заменяем текущую булку
          state.burgerConstructor.bun = action.payload;
        } else {
          // Если не булка, добавляем в массив ингредиентов
          state.burgerConstructor.ingredients.push(action.payload);
        }
      },
      // Функция для подготовки данных перед редьюсером
      prepare: (ingredient: TIngredient) => {
        // Генерируем уникальный ID для ингредиента
        const id = uuidv4();
        // Возвращаем ингредиент с добавленным ID
        return { payload: { ...ingredient, id } };
      }
    },

    // Редьюсер для перемещения ингредиента вверх
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      // Получаем текущий массив ингредиентов
      const array = state.burgerConstructor.ingredients;
      // Получаем индекс перемещаемого ингредиента
      const index = action.payload;
      // Удаляем ингредиент с текущей позиции и вставляем на позицию выше
      array.splice(index - 1, 0, array.splice(index, 1)[0]);
    },

    // Редьюсер для перемещения ингредиента вниз
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const array = state.burgerConstructor.ingredients;
      const index = action.payload;
      // Удаляем ингредиент с текущей позиции и вставляем на позицию ниже
      array.splice(index + 1, 0, array.splice(index, 1)[0]);
    },

    // Редьюсер для удаления ингредиента
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      // Фильтруем массив, оставляя все ингредиенты кроме удаляемого
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },

    // Редьюсер для очистки всего конструктора
    clearBurgerConstructor: (state) => {
      // Сбрасываем булку и массив ингредиентов
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    }
  }
});

export const { burgerConstructorSelector } = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
