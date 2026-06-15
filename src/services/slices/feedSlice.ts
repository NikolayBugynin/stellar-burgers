import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/getFeeds', async () => {
  console.log('Fetching feeds...');
  return getFeedsApi();
});

export const fetchOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    console.log(`Fetching order number ${number}`);
    return getOrderByNumberApi(number);
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  // Feed
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Order by number
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectFeedState: (state) => state,
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectCurrentOrder: (state) => state.currentOrder,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error
  }
});

export const { clearCurrentOrder } = feedSlice.actions;

export const {
  selectFeedState,
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectCurrentOrder,
  selectLoading,
  selectError
} = feedSlice.selectors;

export default feedSlice.reducer;
