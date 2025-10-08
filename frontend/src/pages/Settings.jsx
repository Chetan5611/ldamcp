import React from 'react';
import styles from './Settings.module.css';

export default function Settings({
  microphones,
  selectedMicId,
  onSelectMic,
  categories,
  selectedCategories,
  onToggleCategory,
  alertsEnabled,
  onToggleAlerts
}) {
  return (
    <div className={styles.wrapper}>
      <div className="container card">
        <div className={styles.section}>
          <h2>Microphone</h2>
          <select className={styles.select} value={selectedMicId} onChange={(e) => onSelectMic(e.target.value)}>
            {microphones.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <h2>Alert Preferences</h2>
          <label className={styles.switchRow}>
            <input type="checkbox" checked={alertsEnabled} onChange={(e) => onToggleAlerts(e.target.checked)} />
            <span>LED/Vibration Simulation</span>
          </label>
        </div>

        <div className={styles.section}>
          <h2>Detection Categories</h2>
          <div className={styles.chips}>
            {categories.map((c) => {
              const active = selectedCategories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  className={active ? styles.chipActive : styles.chip}
                  onClick={() => onToggleCategory(c)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


