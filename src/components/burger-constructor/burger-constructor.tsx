import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSelector,
  clearBurgerConstructor
} from '../../services/slices/burger-constructor/slice';
import {
  clearOrder,
  isOrderLoadingSelector,
  orderSelector
} from '../../services/slices/order/slice';
import { useNavigate } from 'react-router-dom';
import { isAuthCheckedSelector } from '../../services/slices/user/slice';
import { orderBurgerThunk } from '../../services/slices/order/actions';

// Компонент конструктора бургера
export const BurgerConstructor: FC = () => {
  // Получение состояния из Redux store
  const constructorItems = useSelector(burgerConstructorSelector); // Ингредиенты в конструкторе
  const orderRequest = useSelector(isOrderLoadingSelector); // Флаг загрузки заказа
  const orderModalData = useSelector(orderSelector); // Данные о заказе
  const isAuthenticated = useSelector(isAuthCheckedSelector); // Флаг авторизации

  // Хуки для навигации и dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Обработчик оформления заказа
  const onOrderClick = () => {
    // Если пользователь не авторизован - перенаправляем на страницу входа
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const { bun, ingredients } = constructorItems;

    // Если нет булки или уже идет запрос - выходим
    if (!bun || orderRequest) return;

    // Формируем данные для заказа: [булка, ингредиенты, булка]
    const orderData: string[] = [
      bun._id, // Верхняя булка
      ...ingredients.map((ingredient) => ingredient._id), // Начинка
      bun._id // Нижняя булка
    ];

    // Отправляем заказ
    dispatch(orderBurgerThunk(orderData));
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    navigate('/', { replace: true }); // Возврат на главную без сохранения в истории
    dispatch(clearOrder()); // Очистка данных заказа
    dispatch(clearBurgerConstructor()); // Очистка конструктора
  };

  // Расчет общей стоимости бургера
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + // Булки учитываются дважды
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ), // Сумма начинок
    [constructorItems] // Зависимости для useMemo
  );

  // Рендер UI-компонента
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
