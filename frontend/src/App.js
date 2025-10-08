import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Demo from './pages/Demo';
import Settings from './pages/Settings';
import Upload from './pages/Upload';

const CATEGORIES = ['Bus', 'Car', 'Truck', 'Train', 'Motorcycle', 'Background Noise'];

export default function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}

function InnerApp() {
  const navigate = useNavigate();

  const [page, setPage] = React.useState('home');
  const [status, setStatus] = React.useState('idle');
  const [detections, setDetections] = React.useState([]);
  const [micList] = React.useState([
    { id: 'default', label: 'Default Microphone' },
    { id: 'stereo', label: 'Stereo USB Mic' }
  ]);
  const [selectedMic, setSelectedMic] = React.useState('default');
  const [alertsEnabled, setAlertsEnabled] = React.useState(true);
  const [selectedCategories, setSelectedCategories] = React.useState(CATEGORIES);

  // Mock detection simulator
  React.useEffect(() => {
    if (status !== 'listening' && status !== 'detecting') return;
    const interval = setInterval(() => {
      setStatus((s) => (s === 'listening' ? 'detecting' : 'listening'));
      const label = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
      const confidence = 70 + Math.random() * 30;
      setDetections((prev) => [
        { id: Math.random().toString(36).slice(2), label, confidence, timestamp: Date.now() },
        ...prev
      ].slice(0, 20));
    }, 1800);
    return () => clearInterval(interval);
  }, [status, selectedCategories]);

  function handleStart() {
    setStatus('listening');
    navigate('/demo');
  }

  function handleStop() {
    setStatus('idle');
  }

  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home status={status} onStart={handleStart} />} />
        <Route path="/demo" element={<Demo detections={detections} status={status} onStart={handleStart} onStop={handleStop} />} />
        <Route path="/settings" element={
          <Settings
            microphones={micList}
            selectedMicId={selectedMic}
            onSelectMic={setSelectedMic}
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            alertsEnabled={alertsEnabled}
            onToggleAlerts={setAlertsEnabled}
          />
        } />
        <Route path="/upload" element={<Upload />} />
      </Routes>
      <Footer />
    </div>
  );
}
