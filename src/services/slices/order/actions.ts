import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../../utils/burger-api';

// Создание асинхронного Thunk-действия для оформления заказа бургера
export const orderBurgerThunk = createAsyncThunk(
  // Уникальное имя действия для Redux хранилища
  'orders/postOrderBurger',

  // Асинхронная функция-обработчик, которая будет вызвана при диспетчеризации этого действия
  async (data: string[]) => {
    // Логирование в консоль для отладки (можно удалить в production)
    console.log('Заказ отправляется...');

    // Вызов API-функции для отправки заказа на сервер и возврат результата
    // data - массив идентификаторов ингредиентов бургера
    return orderBurgerApi(data);
  }
);
