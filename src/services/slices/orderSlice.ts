import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { clearConstructor } from './burgerConstructorSlice';

export interface IOrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  order: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { dispatch }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      dispatch(clearConstructor());
      console.log('clear the constructor after a successful server response');
      return response;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  },
  selectors: {
    selectOrder: (state) => state.order,
    selectOrederLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error
  }
});

export const { clearOrder } = orderSlice.actions;

export const { selectOrder, selectOrederLoading, selectOrderError } =
  orderSlice.selectors;

export default orderSlice.reducer;
