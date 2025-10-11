import './Header.css'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  authButton?: ReactNode;
  isAdmin?: boolean;
}

export default function Header({ authButton, isAdmin = false }: HeaderProps) {
  return (
    <header className="page-header">
      <div className="header-content">
        <h1 className="brand-title">DORA MODAS</h1>
        <div className="header-actions">
          {isAdmin && (
            <>
              <Link to="/add-item" className="admin-add-button">
                <span className="add-icon">➕</span>
                <span className="add-text">Adicionar Item</span>
              </Link>
              <Link to="/upload-image" className="admin-upload-button">
                <span className="upload-icon">📷</span>
                <span className="upload-text">Upload Image</span>
              </Link>
            </>
          )}
          <div className="auth-section">
            {authButton}
          </div>
        </div>
      </div>
    </header>
  )
}
