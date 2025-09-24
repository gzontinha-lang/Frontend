import { Link } from 'react-router-dom'
import './LoginButton.css'


export default function LoginButton() {
  return (
    <Link to="/login" className="login-btn">
      <span className="login-icon">👤</span>
      <span className="login-text">Entrar</span>
    </Link>
  )
}
