import React, { useState, useEffect } from 'react';
import './Loading.css';

interface LoadingProps {
  isVisible: boolean;
  duration?: number; // em milissegundos, padrão 500ms (0.5s)
  onComplete?: () => void;
}

const Loading: React.FC<LoadingProps> = ({ 
  isVisible, 
  duration = 500, 
  onComplete 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onComplete]);

  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
