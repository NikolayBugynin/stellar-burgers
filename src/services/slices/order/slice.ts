import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    console.log('Submitting order...');
    return orderBurgerApi(ingredients);
  }
);

export interface IorderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IorderState = {
  order: null,
  isLoading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
      });
  },
  selectors: {
    selectOrder: (state) => state.order,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error
  }
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrder, selectOrderLoading, selectOrderError } =
  orderSlice.selectors;
export default orderSlice.reducer;
