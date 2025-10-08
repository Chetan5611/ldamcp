import React from 'react';
import styles from './StatusIndicator.module.css';

const STATUS_TO_COLOR = {
  idle: '#6b7280',
  listening: '#1e6bd6',
  detecting: '#22c55e'
};

export default function StatusIndicator({ status }) {
  const label = (status || 'idle').toLowerCase();
  const color = STATUS_TO_COLOR[label] || STATUS_TO_COLOR.idle;
  return (
    <div className={styles.wrapper}>
      <span className={styles.dot} style={{ backgroundColor: color }} />
      <span className={styles.text}>{label === 'idle' ? 'Idle' : label === 'listening' ? 'Listening' : 'Detecting…'}</span>
    </div>
  );
}


