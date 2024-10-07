import React from 'react';

const Loader = () => {
  // Neon animation keyframes for both the text and circular loader
  const neonKeyframes = `
   

    @keyframes rotateCircle {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#141414', 
    },

    circle: {
      width: '80px',
      height: '80px',
      border: '4px solid rgba(0, 204, 255, 0.2)',
      borderTop: '4px solid rgba(0, 204, 255, 1)', // Neon blue glow
      borderRadius: '50%',
      animation: 'rotateCircle 1.5s infinite linear', // Rotating animation
      
    },
    glowEffect: {
      boxShadow: '0 0 10px rgba(0, 204, 255, 0.7), 0 0 20px rgba(0, 204, 255, 0.5)',
    },
  };

  return (
    <div style={styles.container}>
      <style>{neonKeyframes}</style> {/* Add the keyframes animation */}
      
      {/* Circular rotating neon loader */}
      <div style={{ ...styles.circle, ...styles.glowEffect }}></div>
      
      {/* Loading text with neon pulse animation */}
      {/* <div style={styles.loader}>Loading</div> */}
    </div>
  );
};

export default Loader;
