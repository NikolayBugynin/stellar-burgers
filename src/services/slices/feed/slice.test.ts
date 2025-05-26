import reducer, {
  getFeedsThunk,
  fetchOrderByNumber,
  clearCurrentOrder,
  IFeedState
} from './slice';

describe('feedSlice reducer', () => {
  const initialState: IFeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    currentOrder: null,
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getFeedsThunk', () => {
    it('обрабатывает pending', () => {
      const action = { type: getFeedsThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обрабатывает fulfilled', () => {
      const payload = {
        orders: [{ id: '1' }],
        total: 10,
        totalToday: 5
      };
      const action = { type: getFeedsThunk.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(payload.orders);
      expect(state.total).toBe(payload.total);
      expect(state.totalToday).toBe(payload.totalToday);
      expect(state.error).toBeNull();
    });

    it('обрабатывает rejected', () => {
      const action = { type: getFeedsThunk.rejected.type, payload: 'Ошибка' };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('fetchOrderByNumber', () => {
    it('обрабатывает pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обрабатывает fulfilled', () => {
      const payload = { orders: [{ id: 'order1' }] };
      const action = { type: fetchOrderByNumber.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(payload.orders[0]);
      expect(state.error).toBeNull();
    });

    it('обрабатывает rejected', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: 'Ошибка'
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  it('очищает currentOrder через clearCurrentOrder', () => {
    const stateWithOrder: IFeedState = {
      ...initialState,
      currentOrder: { id: 'order1' } as any
    };
    const state = reducer(stateWithOrder, clearCurrentOrder());
    expect(state.currentOrder).toBeNull();
  });
});
