import reducer, {
  fetchIngredients,
  IngredientsState,
  initialState
} from './slice';

describe('ingredientsSlice reducer', () => {
  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('устанавливает isLoading в true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('записывает данные и сбрасывает isLoading при fetchIngredients.fulfilled', () => {
    const mockItems = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 10,
        price: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockItems
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockItems);
    expect(state.error).toBeNull();
  });

  it('записывает ошибку и сбрасывает isLoading при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
