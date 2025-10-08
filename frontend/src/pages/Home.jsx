import React from 'react';
import StatusIndicator from '../components/StatusIndicator';
import styles from './Home.module.css';

export default function Home({ status, onStart }) {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.hero + ' card'}>
          <h1>AI-Powered Auditory Alert System</h1>
          <p className={styles.subtitle}>
            Real-time detection and classification of vehicle sounds with directional awareness.
          </p>
          <div className={styles.controls}>
            <button className={styles.primaryBtn} type="button" onClick={onStart}>Start Detection</button>
            <StatusIndicator status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}


