import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  isAuthCheckedSelector,
  loginUserRequestSelector
} from '../../services/slices/user/slice';

// Определение типов для пропсов компонента
type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // Флаг, указывающий что маршрут только для НЕавторизованных
  children: React.ReactElement; // Дочерний элемент для рендеринга
};

// Компонент защищенного маршрута
export const ProtectedRoute = ({
  onlyUnAuth = false, // Значение по умолчанию - false (маршрут для авторизованных)
  children
}: ProtectedRouteProps) => {
  // Получаем состояние авторизации из Redux хранилища
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const loginUserRequest = useSelector(loginUserRequestSelector);

  // Получаем текущий location из react-router
  const location = useLocation();

  // Пока проверяется авторизация и идет запрос - показываем прелоадер
  if (!isAuthChecked && loginUserRequest) {
    return <Preloader />;
  }

  // Если маршрут защищенный (только для авторизованных) и пользователь не авторизован
  if (!onlyUnAuth && !isAuthChecked) {
    // Перенаправляем на страницу логина, сохраняя предыдущий location
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для НЕавторизованных и пользователь авторизован
  if (onlyUnAuth && isAuthChecked) {
    // Перенаправляем на главную или сохраненный location
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} state={location} />;
  }

  // Если все проверки пройдены - рендерим дочерний компонент
  return children;
};
