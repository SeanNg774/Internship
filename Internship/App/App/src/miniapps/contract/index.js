import React from 'react';

const ContractMiniApp = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ef4444', // Tailwind red-500
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    text: {
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      padding: '20px',
      border: '2px solid white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    subtitle: {
      color: '#fee2e2', // Tailwind red-100
      fontSize: '16px',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Contract Mini-App Connected!</h1>
      <p style={styles.subtitle}>Ready for Module Federation.</p>
    </div>
  );
};

export default ContractMiniApp;