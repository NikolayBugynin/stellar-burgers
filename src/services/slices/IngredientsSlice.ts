import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Синхронные редюсеры (если нужны)
    clearIngredients: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          'Failed to load ingredients. Please try again later';
      });
  }
});

// Экшены
export const { clearIngredients } = ingredientsSlice.actions;

// Селекторы

export const selectIngredients = (state: { ingredients: IngredientsState }) =>
  state.ingredients.items;

export const selectIngredientsIsLoading = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.loading;

export const selectIngredientsError = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.error;

export default ingredientsSlice.reducer;
