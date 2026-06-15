import { BurgerConstructorElementUI } from '@ui';
import { FC, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { moveIngredient } from '../../services/slices/burgerConstructorSlice';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = useCallback(() => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ index, direction: 'down' }));
      }
    }, [dispatch, index, totalItems]);

    const handleMoveUp = () => {};

    const handleClose = () => {};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={() => handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
