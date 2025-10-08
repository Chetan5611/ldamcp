import React from 'react';
import styles from './Upload.module.css';

export default function Upload() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [recordStatus, setRecordStatus] = React.useState('Idle');

  function handleFiles(files) {
    const f = files && files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function onSelect(e) {
    handleFiles(e.target.files);
  }

  async function mockAnalyze() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    // Mock latency and response
    await new Promise((r) => setTimeout(r, 1500));
    const labels = ['Ambulance', 'Fire Truck', 'Police Siren', 'Bus', 'Car', 'Truck', 'Train', 'Motorcycle', 'Background Noise'];
    const label = labels[Math.floor(Math.random() * labels.length)];
    const confidence = Math.round(70 + Math.random() * 30);
    setResult({ label, confidence });
    setLoading(false);
  }

  function startRecording() {
    setRecording(true);
    setRecordStatus('Recording…');
  }

  async function stopRecordingAndAnalyze() {
    if (!recording) return;
    setRecording(false);
    setRecordStatus('Analyzing…');
    // Simulate generating a blob and analyzing
    await new Promise((r) => setTimeout(r, 1400));
    const labels = ['Ambulance', 'Fire Truck', 'Police Siren', 'Bus', 'Car', 'Truck', 'Train', 'Motorcycle', 'Background Noise'];
    const label = labels[Math.floor(Math.random() * labels.length)];
    const confidence = Math.round(70 + Math.random() * 30);
    setResult({ label, confidence });
    setRecordStatus('Idle');
  }

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.panel}>
          <h2>Upload Audio</h2>
          <p className={styles.sub}>Drag & drop an audio file here, or click to browse.</p>
          <div
            className={isDragging ? styles.dropzoneActive : styles.dropzone}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            {file ? (
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{file.name}</div>
                <div className={styles.fileMeta}>{Math.round(file.size / 1024)} KB</div>
              </div>
            ) : (
              <div className={styles.dropHint}>Drop audio (wav/mp3) here</div>
            )}
            <input id="file-input" type="file" accept="audio/*" onChange={onSelect} hidden />
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} type="button" onClick={mockAnalyze} disabled={!file || loading}>
              {loading ? 'Analyzing…' : 'Analyze Audio'}
            </button>
            {file && (
              <button className={styles.secondaryBtn} type="button" onClick={() => { setFile(null); setResult(null); }}>
                Clear
              </button>
            )}
          </div>

          {result && (
            <div className={styles.result + ' card'}>
              <div className={styles.resultRow}>
                <div className={styles.resultLabel}>{result.label}</div>
                <div className={styles.resultConf}>{result.confidence}%</div>
              </div>
              <div className={styles.resultHint}>Mock result. Backend integration pending.</div>
            </div>
          )}
        </div>

        <div className={styles.panel} style={{ marginTop: 16 }}>
          <h2>Record & Analyze</h2>
          <p className={styles.sub}>Simulated microphone recording and analysis.</p>
          <div className={styles.recordRow}>
            <div className={styles.recordStatusBox}>
              <div className={styles.recordDot + (recording ? ' ' + styles.recordDotActive : '')} />
              <div className={styles.recordText}>{recordStatus}</div>
            </div>
            {!recording ? (
              <button type="button" className={styles.primaryBtn} onClick={startRecording}>Start Recording</button>
            ) : (
              <button type="button" className={styles.secondaryBtn} onClick={stopRecordingAndAnalyze}>Stop & Analyze</button>
            )}
          </div>
          {recording && (
            <div className={styles.waveRow}>
              <div className={styles.waveBar} /><div className={styles.waveBar} /><div className={styles.waveBar} /><div className={styles.waveBar} /><div className={styles.waveBar} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


