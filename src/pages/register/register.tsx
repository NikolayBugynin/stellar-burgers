import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { clearErrors, errorSelector } from '../../services/slices/user/slice';
import { registerUserThunk } from '../../services/slices/user/actions';

export const Register: FC = () => {
  // Инициализация Redux хуков
  const dispatch = useDispatch(); // Хук для отправки действий
  const error = useSelector(errorSelector); // Получение ошибки из хранилища

  // Состояние формы
  const [userName, setUserName] = useState(''); // Имя пользователя
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Пароль

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    // Отправляем действие регистрации с данными формы
    dispatch(
      registerUserThunk({
        name: userName,
        email,
        password
      })
    );
  };

  // Эффект для очистки ошибок при монтировании компонента
  useEffect(() => {
    dispatch(clearErrors()); // Очищаем возможные предыдущие ошибки
  }, []); // Пустой массив зависимостей = выполняется только при монтировании

  // Рендер UI-компонента формы регистрации
  return (
    <RegisterUI
      errorText={error!} // Передаем текст ошибки (non-null assertion, так как error может быть null)
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
