import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  loading: false,
  error: null
};

// Thunks
export const getFeedsThunk = createAsyncThunk('feeds/getFeeds', async () => {
  console.log('Fetching feeds...');
  return getFeedsApi();
});

export const fetchOrderByNumber = createAsyncThunk(
  'orders/getOrder',
  async (number: number) => {
    console.log(`Fetching order #${number}...`);
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
  extraReducers: (builder) => {
    builder
      // Feed
      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.loading = false;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Order by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0];
        state.loading = false;
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
