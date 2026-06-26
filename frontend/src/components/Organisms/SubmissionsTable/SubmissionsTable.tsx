import { Badge } from '../../Atoms/Badge/Badge';
import { Button } from '../../Atoms/Button/Button';
import styles from './SubmissionsTable.module.css';

export interface Submission {
  id: number;
  journalName: string;
  area: string;
  issn: string;
  qualis: string;
  description: string;
  officialLink: string;
  category: string;
  hasFee: boolean;
  submittedBy: string;
  submittedAt: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => void;
  onViewDetails: (submission: Submission) => void;
  onReject: (submission: Submission) => void;
}

export function SubmissionsTable({
  submissions,
  onApprove,
  onViewDetails,
  onReject,
}: SubmissionsTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Nome da Revista</th>
            <th className={styles.th}>Área</th>
            <th className={styles.th}>ISSN</th>
            <th className={styles.th}>Qualis</th>
            <th className={styles.th}>Enviado por</th>
            <th className={styles.th}>Data de Envio</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.journalName}>{submission.journalName}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.cellText}>{submission.area}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.cellMuted}>{submission.issn}</span>
              </td>
              <td className={styles.td}>
                <Badge label={submission.qualis} />
              </td>
              <td className={styles.td}>
                <span className={styles.cellText}>{submission.submittedBy}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.cellMuted}>{submission.submittedAt}</span>
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <Button
                    variant="primary"
                    className={styles.approveBtn}
                    onClick={() => onApprove(submission)}
                  >
                    Aprovar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm" // essa bomba de botão tinha ficado gigante mano
                    className={styles.detailsBtn}
                    onClick={() => onViewDetails(submission)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="danger"
                    className={styles.rejectBtn}
                    onClick={() => onReject(submission)}
                  >
                    Rejeitar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}