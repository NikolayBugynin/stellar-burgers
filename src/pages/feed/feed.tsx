import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ordersSelector } from '../../services/slices/feed/slice';
import { getFeedsThunk } from '../../services/slices/feed/actions';

export const Feed: FC = () => {
  // Инициализация Redux хуков
  const dispatch = useDispatch(); // Хук для отправки действий
  const orders: TOrder[] = useSelector(ordersSelector); // Получение заказов из хранилища

  // Эффект для загрузки данных при монтировании компонента
  useEffect(() => {
    dispatch(getFeedsThunk()); // Запрашиваем данные о заказах
  }, []); // Пустой массив зависимостей = выполняется только при монтировании

  // Отображаем прелоадер, если заказов нет
  if (!orders.length) {
    return <Preloader />;
  }

  // Рендер UI-компонента ленты заказов
  return (
    <FeedUI
      orders={orders} // Передаем массив заказов
      handleGetFeeds={() => {
        dispatch(getFeedsThunk()); // Функция для обновления данных
      }}
    />
  );
};
