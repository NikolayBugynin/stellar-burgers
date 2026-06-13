import reducer, {
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor,
  IBurgerConstructorState,
  initialState
} from './slice';
import { TIngredient } from '@utils-types';

// Мокаем nanoid, чтобы id был предсказуемым
jest.mock('@reduxjs/toolkit', () => {
  const originalModule = jest.requireActual('@reduxjs/toolkit');
  return {
    ...originalModule,
    nanoid: () => 'test-id'
  };
});

describe('burgerConstructorSlice reducer', () => {
  const mockBun: TIngredient = {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 20,
    carbohydrates: 50,
    calories: 400,
    price: 100,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url'
  };

  const mockIngredient1: TIngredient = {
    _id: 'ing1',
    name: 'Соус',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 50,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url'
  };

  const mockIngredient2: TIngredient = {
    _id: 'ing2',
    name: 'Мясо',
    type: 'main',
    proteins: 40,
    fat: 30,
    carbohydrates: 20,
    calories: 100,
    price: 150,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url'
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('добавляет булку', () => {
    const nextState = reducer(initialState, addIngredient(mockBun));
    expect(nextState.bun).toEqual({ ...mockBun, id: 'test-id' });
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('добавляет ингредиент', () => {
    const nextState = reducer(initialState, addIngredient(mockIngredient1));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual({
      ...mockIngredient1,
      id: 'test-id'
    });
    expect(nextState.bun).toBeNull();
  });

  it('удаляет ингредиент по id', () => {
    const stateWithIngredients: IBurgerConstructorState = {
      bun: null,
      ingredients: [
        { ...mockIngredient1, id: 'id1' },
        { ...mockIngredient2, id: 'id2' }
      ]
    };
    const nextState = reducer(stateWithIngredients, removeIngredient('id1'));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('id2');
  });

  it('перемещает ингредиент вверх', () => {
    const stateWithIngredients: IBurgerConstructorState = {
      bun: null,
      ingredients: [
        { ...mockIngredient1, id: 'id1' },
        { ...mockIngredient2, id: 'id2' }
      ]
    };
    const action = moveIngredient(1, 'up');
    const newState = reducer(stateWithIngredients, action);

    expect(newState.ingredients[0].id).toBe('id2');
    expect(newState.ingredients[1].id).toBe('id1');
  });

  it('перемещает ингредиент вниз', () => {
    const stateWithIngredients: IBurgerConstructorState = {
      bun: null,
      ingredients: [
        { ...mockIngredient1, id: 'id1' },
        { ...mockIngredient2, id: 'id2' }
      ]
    };
    const action = moveIngredient(0, 'down'); // переместить элемент с индексом 0 вниз
    const newState = reducer(stateWithIngredients, action);

    expect(newState.ingredients[0].id).toBe('id2');
    expect(newState.ingredients[1].id).toBe('id1');
  });

  it('очищает конструктор', () => {
    const stateWithData: IBurgerConstructorState = {
      bun: { ...mockBun, id: 'id-bun' },
      ingredients: [{ ...mockIngredient1, id: 'id1' }]
    };
    const nextState = reducer(stateWithData, clearConstructor());
    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(0);
  });
});
