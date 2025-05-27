import {
  createSlice,
  PayloadAction,
  nanoid,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export interface IBurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const calculateTotalPrice = (state: IBurgerConstructorState): number => {
  const bunPrice = state.bun ? state.bun.price * 2 : 0;
  return (
    bunPrice + state.ingredients.reduce((sum, item) => sum + item.price, 0)
  );
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    selectConstructorItems: createSelector(
      [
        (state: IBurgerConstructorState) => state.bun,
        (state: IBurgerConstructorState) => state.ingredients
      ],
      (bun, ingredients) => ({ bun, ingredients })
    ),
    selectTotalPrice: (state) => calculateTotalPrice(state)
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    moveIngredient: {
      reducer: (
        state,
        action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
      ) => {
        const { index, direction } = action.payload;
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < state.ingredients.length) {
          // Создаем новый массив для иммутабельности
          const updatedIngredients = [...state.ingredients];
          // Меняем местами элементы
          [updatedIngredients[index], updatedIngredients[newIndex]] = [
            updatedIngredients[newIndex],
            updatedIngredients[index]
          ];
          state.ingredients = updatedIngredients;
        }
      },
      prepare: (index: number, direction: 'up' | 'down') => ({
        payload: { index, direction }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { selectConstructorItems, selectTotalPrice } =
  burgerConstructorSlice.selectors;

export const {
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
