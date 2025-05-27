import reducer, { clearErrors, IUSerState, initialState } from './slice';
import {
  loginUserThunk,
  logoutUserThunk,
  getUserThunk,
  registerUserThunk,
  updateUserThunk,
  getOrdersThunk
} from './actions';

describe('userSlice reducer', () => {
  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // loginUserThunk
  it('обрабатывает loginUserThunk.pending', () => {
    const action = { type: loginUserThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает loginUserThunk.fulfilled', () => {
    const mockUser = { name: 'Test User' } as any;
    const action = { type: loginUserThunk.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('обрабатывает loginUserThunk.rejected', () => {
    const action = {
      type: loginUserThunk.rejected.type,
      error: { message: 'Ошибка логина' }
    };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.error).toBe('Ошибка логина');
  });

  // logoutUserThunk
  it('обрабатывает logoutUserThunk.fulfilled', () => {
    const stateWithUser: IUSerState = {
      ...initialState,
      user: { name: 'Test' } as any,
      isAuthenticated: true
    };
    const action = { type: logoutUserThunk.fulfilled.type };
    const state = reducer(stateWithUser, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  // getUserThunk
  it('обрабатывает getUserThunk.pending', () => {
    const action = { type: getUserThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
  });

  it('обрабатывает getUserThunk.fulfilled', () => {
    const mockUser = { name: 'Fetched User' } as any;
    const action = { type: getUserThunk.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('обрабатывает getUserThunk.rejected', () => {
    const action = {
      type: getUserThunk.rejected.type,
      error: { message: 'Ошибка получения пользователя' }
    };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe('Ошибка получения пользователя');
  });

  // registerUserThunk
  it('обрабатывает registerUserThunk.fulfilled', () => {
    const mockUser = { name: 'New User' } as any;
    const action = {
      type: registerUserThunk.fulfilled.type,
      payload: mockUser
    };
    const state = reducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  // updateUserThunk
  it('обрабатывает updateUserThunk.fulfilled', () => {
    const initialWithUser: IUSerState = {
      ...initialState,
      user: { name: 'Old Name' } as any,
      loginUserRequest: true
    };
    const updatedUser = { user: { name: 'Updated Name' } } as any;
    const action = {
      type: updateUserThunk.fulfilled.type,
      payload: updatedUser
    };
    const state = reducer(initialWithUser, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.user).toEqual(updatedUser.user);
  });

  // getOrdersThunk
  it('обрабатывает getOrdersThunk.fulfilled', () => {
    const mockOrders = [{ id: 'order1' }, { id: 'order2' }] as any[];
    const action = { type: getOrdersThunk.fulfilled.type, payload: mockOrders };
    const state = reducer(initialState, action);
    expect(state.orders).toEqual(mockOrders);
    expect(state.ordersRequest).toBe(false);
  });

  // clearErrors
  it('очищает ошибки', () => {
    const stateWithError: IUSerState = {
      ...initialState,
      error: 'Some error'
    };
    const state = reducer(stateWithError, clearErrors());
    expect(state.error).toBeNull();
  });
});
