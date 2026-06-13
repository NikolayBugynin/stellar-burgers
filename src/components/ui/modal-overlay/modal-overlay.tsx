import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({
  onClick,
  'data-cy': dataCy
}: {
  onClick: () => void;
  'data-cy'?: string;
}) => <div className={styles.overlay} onClick={onClick} data-cy={dataCy} />;
