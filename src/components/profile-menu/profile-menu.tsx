import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { ProfileMenuUI } from '@ui';
import { logoutUserThunk } from '../../services/slices/user/actions';

// Компонент меню профиля
export const ProfileMenu: FC = () => {
  // Получаем текущий путь страницы
  const { pathname } = useLocation();

  // Хуки для работы с Redux и навигацией
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logoutUserThunk()); // Отправляем действие выхода
    navigate('/'); // Перенаправляем на главную страницу
  };

  // Рендерим UI-компонент, передавая текущий путь и обработчик выхода
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
