import React, { useCallback } from 'react';
import { Modal } from '../../Atoms/Modal/Modal';
import { Button } from '../../Atoms/Button/Button';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  /** Controla a visibilidade  */
  isOpen: boolean;
  /** Callback para fechar/cancelar */
  onClose: () => void;
  /** Ação assíncrona executada ao confirmar */
  onConfirm: () => Promise<void>;
  /** Título exibido no cabeção do coisa */
  title: string;
  /** Mensagem de alerta — aceita string ou JSX */
  message: React.ReactNode;
  /** Indica processamento em andamento; desabilita ambos os botões */
  isLoading?: boolean;
  /** Rótulo customizável do botão de confirmação */
  confirmText?: string;
  /** Rótulo customizável do botão de cancelamento */
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  const handleConfirm = useCallback(async () => {
    if (isLoading) return;
    await onConfirm();
  }, [isLoading, onConfirm]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    onClose();
  }, [isLoading, onClose]);

  return (
    <Modal isOpen={isOpen} title={title} onClose={handleClose}>
      <div
        className={styles.container}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
      >
        {/* aviso decorativo */}
        <div className={styles.iconWrap} aria-hidden="true">
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="9" x2="12" y2="13" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Cabeção */}
        <header className={styles.header}>
          <h2 id="confirmation-modal-title" className={styles.title}>
            {title}
          </h2>
        </header>

        {/* Corpinho */}
        <div id="confirmation-modal-message" className={styles.body}>
          {typeof message === 'string' ? (
            <p className={styles.message}>{message}</p>
          ) : (
            message
          )}
        </div>

        {}
        <footer className={styles.footer}>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </footer>
      </div>
    </Modal>
  );
};