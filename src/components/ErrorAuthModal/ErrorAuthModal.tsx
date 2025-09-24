import React from 'react';
import './ErrorAuthModal.css';

interface ErrorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const ErrorAuthModal: React.FC<ErrorAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  message = "Não autenticado" 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="error-auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="error-auth-modal">
        <div className="error-auth-modal-header">
          <h2>Erro de Autenticação</h2>
          <button 
            className="error-auth-modal-close" 
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>
        
        <div className="error-auth-modal-body">
          <div className="error-auth-modal-icon">
            ⚠️
          </div>
          <p className="error-auth-modal-description">
            Email ou senha inválidos.
          </p>
        </div>
        
        <div className="error-auth-modal-footer">
          <button 
            className="error-auth-modal-button error-auth-modal-button-primary"
            onClick={onClose}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAuthModal;
