import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    window.location.href = 'https://kshwhwb3.github.io/la27productions/';
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#000000', 
      color: '#ffffff', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <p>Cargando La 27 Productions...</p>
    </div>
  );
}
