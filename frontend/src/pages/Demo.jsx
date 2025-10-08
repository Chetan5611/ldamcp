import React from 'react';
import DetectionCard from '../components/DetectionCard';
import WaveformGraph from '../components/WaveformGraph';
import styles from './Demo.module.css';

export default function Demo({ detections, status, onStart, onStop }) {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left + ' card'}>
            <div className={styles.headerRow}>
              <h2>Live Detections</h2>
              <div className={styles.controls}>
                {status === 'idle' && (
                  <button className={styles.primaryBtn} type="button" onClick={onStart}>Start Detecting</button>
                )}
                {(status === 'listening' || status === 'detecting') && (
                  <button className={styles.secondaryBtn} type="button" onClick={onStop}>Stop Detecting</button>
                )}
              </div>
            </div>
            <div className={styles.list}>
              {detections.length === 0 && (
                <div className={styles.empty}>No detections yet.</div>
              )}
              {detections.map((d) => (
                <DetectionCard key={d.id} label={d.label} confidence={d.confidence} timestamp={d.timestamp} />
              ))}
            </div>
          </div>

          <div className={styles.right + ' card'}>
            <h2>Waveform</h2>
            <WaveformGraph />
          </div>
        </div>
      </div>
    </div>
  );
}


