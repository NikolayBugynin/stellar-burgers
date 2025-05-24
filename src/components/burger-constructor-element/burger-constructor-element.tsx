import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../..//services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/burger-constructor/slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = useCallback(() => {
      if (index > 0) {
        dispatch(moveIngredient(index, 'up'));
      }
    }, [dispatch, index]);

    const handleMoveDown = useCallback(() => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient(index, 'down'));
      }
    }, [dispatch, index, totalItems]);

    const handleClose = useCallback(() => {
      dispatch(removeIngredient(ingredient.id));
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
