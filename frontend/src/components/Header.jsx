import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.badge} />
          <div className={styles.title}>SaarthiSahayta</div>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Home</NavLink>
          <NavLink to="/demo" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Demo</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Settings</NavLink>
          <NavLink to="/upload" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Upload</NavLink>
        </nav>
      </div>
    </header>
  );
}


