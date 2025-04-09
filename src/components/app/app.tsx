import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredientsThunk } from '../../services/slices/ingredients/actions';
import { getUserThunk } from '../../services/slices/user/actions';

const App = () => {
  // Инициализация хуков для работы с Redux и маршрутизацией
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем background location для модальных окон
  const background = location.state?.background;

  // Эффект для первоначальной загрузки данных
  useEffect(() => {
    console.log('Запрашиваю пользователя...');
    // Загружаем список ингредиентов
    dispatch(getIngredientsThunk());
    // Загружаем данные пользователя
    dispatch(getUserThunk()).then(() => {
      console.log('Пользователь загружен');
    });
  }, []); // Пустой массив зависимостей - выполняется один раз при монтировании

  return (
    <div className={styles.app}>
      {/* Общий header для всего приложения */}
      <AppHeader />

      {/* Основные маршруты приложения */}
      <Routes location={background || location}>
        {/* Главная страница с конструктором бургеров */}
        <Route path='/' element={<ConstructorPage />} />

        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Страница ингредиента */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Маршруты для авторизации (только для неавторизованных) */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты профиля (только для авторизованных) */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Маршрут для 404 ошибки */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Дополнительные маршруты для модальных окон */}
      {background && (
        <Routes>
          {/* Модальное окно заказа из ленты */}
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Информация о заказе'} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />

          {/* Модальное окно деталей ингредиента */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />

          {/* Модальное окно заказа из профиля */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={'Информация о заказе'}
                  onClose={() => navigate(-1)}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
