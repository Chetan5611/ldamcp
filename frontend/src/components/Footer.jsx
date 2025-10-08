import React from 'react';
import styles from './Footer.module.css';
import vid from '../assets/background-video.mp4';

export default function Footer() {
  return (
    <div className={styles.video}>
    <video
    className={styles.background}
    src={vid}
    autoPlay
    loop
    muted
    playsInline
  ></video>
    </div>
  );
}


