import {
  calculateTotalPrice,
  IBurgerConstructorState
} from '../slices/burger-constructor/slice';
import { RootState } from '../store';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectTotalPrice = (state: IBurgerConstructorState) =>
  calculateTotalPrice(state);
