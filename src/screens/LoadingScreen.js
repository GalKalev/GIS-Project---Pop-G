import React from 'react';
import { Box } from '@mui/material';
import Logo from '../components/Logo';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999, 
        flexDirection:'column'
      }}
    >
      <Logo style={{ width: '100px', animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h1>Loading...</h1>
    </Box>
  );
};

export default LoadingScreen;
