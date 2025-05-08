import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/user/slice';
import {
  clearOrder,
  createOrder,
  selectOrder,
  selectOrderLoading
} from '../../services/slices/order/slice';
import {
  selectConstructorItems,
  clearConstructor,
  selectTotalPrice
} from '../../services/slices/burger-constructor/slice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrder);
  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectTotalPrice);

  // Оформление заказа
  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const orderIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderIngredients));
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
    navigate('/');
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
