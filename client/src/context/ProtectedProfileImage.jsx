import { useState, useEffect, useRef } from 'react';

const ProtectedProfileImage = ({ imageUrl, userId, size = 200 }) => {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef(null);

  // Protection against screenshot attempts
  useEffect(() => {
    const handleBlur = () => setVisible(false);
    const handleFocus = () => setVisible(true);
    
    // Window focus/blur events
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Print events (some screenshot tools trigger these)
    window.addEventListener('beforeprint', handleBlur);
    window.addEventListener('afterprint', handleFocus);
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      setVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeprint', handleBlur);
      window.removeEventListener('afterprint', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Protection against right-click saving
  useEffect(() => {
    const preventDefault = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventDefault);
    return () => document.removeEventListener('contextmenu', preventDefault);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        margin: '0 auto'
      }}
    >
      {visible ? (
        <>
          {/* Main Profile Image */}
          <img
            src={imageUrl}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              pointerEvents: 'none',
              borderRadius: '50%',
              position: 'relative'
            }}
          />
          
          {/* Watermark Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text x='0' y='15' font-family='Arial' font-size='12' fill-opacity='0.07' fill='black' transform='rotate(-45 50,50)'>${userId}</text></svg>") repeat`,
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            borderRadius: '50%'
          }} />
          
          {/* Protection Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.02)',
            pointerEvents: 'none',
            mixBlendMode: 'hard-light',
            borderRadius: '50%'
          }} />
        </>
      ) : (
        // Placeholder when protection is active
        <div style={{
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '10px',
          boxSizing: 'border-box'
        }}>
          Profile image hidden for protection
        </div>
      )}
    </div>
  );
};

export default ProtectedProfileImage;