import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Organisms/Sidebar/Sidebar';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  return (
    <div className={styles.adminContainer}>
      {/*  barra lateral fixa na esquerda */}
      <Sidebar />
      
      {/* vai mudar na direita */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}