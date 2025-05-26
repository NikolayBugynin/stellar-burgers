import reducer, { createOrder, clearOrder, IorderState } from './slice';

describe('orderSlice reducer', () => {
  const initialState: IorderState = {
    order: null,
    isLoading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('устанавливает isLoading в true при createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('записывает ошибку и сбрасывает isLoading при createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка создания заказа' }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });

  it('записывает заказ и сбрасывает isLoading при createOrder.fulfilled', () => {
    const mockOrder = { id: 'order1', number: 123 } as any;
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
  });

  it('очищает состояние при clearOrder', () => {
    const stateWithData: IorderState = {
      order: { id: 'order1' } as any,
      isLoading: true,
      error: 'Ошибка'
    };
    const state = reducer(stateWithData, clearOrder());
    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
