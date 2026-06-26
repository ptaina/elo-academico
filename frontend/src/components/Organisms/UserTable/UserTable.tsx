import { Badge } from '../../Atoms/Badge/Badge';
import styles from './UserTable.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  registeredAt: string;
  totalSubmissions: number;
}

interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onBanUser: (user: User) => void;
}

export function UserTable({ users, onViewDetails, onBanUser }: UserTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Nome</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.userName}>{user.name}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.userEmail}>{user.email}</span>
              </td>
              <td className={styles.td}>
                <Badge label={user.status} />
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <button
                    className={styles.detailsBtn}
                    onClick={() => onViewDetails(user)}
                  >
                    Detalhes
                  </button>
                  <button
                    className={styles.banBtn}
                    onClick={() => onBanUser(user)}
                  >
                    Banir usuário
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}