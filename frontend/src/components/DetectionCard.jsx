import React from 'react';
import styles from './DetectionCard.module.css';

export default function DetectionCard({ label, confidence, timestamp }) {
  const pct = Math.round(confidence);
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.label}>{label}</div>
        <div className={styles.confidence}>{pct}%</div>
      </div>
      <div className={styles.meta}>Detected at {new Date(timestamp).toLocaleTimeString()}</div>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}


