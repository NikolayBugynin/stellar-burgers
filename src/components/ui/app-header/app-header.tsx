import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  // Helper function to determine active link
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={clsx(
              styles.link,
              'text text_type_main-default ml-2 mr-10',
              { [styles.link_active]: isActive('/') }
            )}
            end
          >
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <span className='ml-2'>Конструктор</span>
          </NavLink>

          <NavLink
            to='/feed'
            className={clsx(styles.link, 'text text_type_main-default ml-2', {
              [styles.link_active]: isActive('/feed')
            })}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <span className='ml-2'>Лента заказов</span>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={clsx(styles.link, 'text text_type_main-default ml-2', {
              [styles.link_active]: location.pathname.startsWith('/profile')
            })}
          >
            <ProfileIcon
              type={
                location.pathname.startsWith('/profile')
                  ? 'primary'
                  : 'secondary'
              }
            />
            <span className='ml-2'>{userName || 'Личный кабинет'}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
