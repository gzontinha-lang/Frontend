import React from 'react';
import { Link } from 'react-router-dom';
import './LogoutButton.css';
import { clearAuth } from '../../api/requests';

interface LogoutButtonProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isAuthenticated, onLogout }) => {
  const handleLogout = () => {
    clearAuth();
    if (onLogout) {
      onLogout();
    }
  };

  if (isAuthenticated) {
    return (
      <button 
        className="logout-button"
        onClick={handleLogout}
      >
        Sair
      </button>
    );
  }

  return (
    <Link 
      to="/login" 
      className="login-button-link"
    >
      Entrar
    </Link>
  );
};

export default LogoutButton;
