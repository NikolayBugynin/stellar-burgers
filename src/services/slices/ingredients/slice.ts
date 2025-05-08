import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

export interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

const IngredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          'Failed to load ingredients. Please try again later.';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        console.log('Successfully loaded ingredients:', action.payload);
      });
  },
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error
  }
});

export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} = IngredientSlice.selectors;

export default IngredientSlice.reducer;
