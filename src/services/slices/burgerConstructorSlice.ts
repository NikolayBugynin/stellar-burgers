import {
  createSelector,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

interface IBurgerConstructor {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IBurgerConstructor = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item._id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'down' | 'up' }>
    ) => {
      const { index, direction } = action.payload;
      const newIndex = direction === 'down' ? index + 1 : index - 1;

      if (newIndex >= 0 && newIndex < state.ingredients.length) {
        const updatedIngredients = [...state.ingredients];
        [updatedIngredients[index], updatedIngredients[newIndex]] = [
          updatedIngredients[newIndex],
          updatedIngredients[index]
        ];
        state.ingredients = updatedIngredients;
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: createSelector(
      [(state) => state.bun, (state) => state.ingredients],
      (bun, ingredients) => ({ bun, ingredients })
    ),
    selectTotalPrice: (state) => {
      const bunPrice = state.bun ? state.bun.price * 2 : 0;
      return (
        bunPrice + state.ingredients.reduce((sum, item) => sum + item.price, 0)
      );
    },
    selectIngredientsCount: (state) => state.ingredients.length,
    selectIsEmpty: (state) => !state.bun && state.ingredients.length === 0
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const {
  selectConstructorItems,
  selectTotalPrice,
  selectIngredientsCount,
  selectIsEmpty
} = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
