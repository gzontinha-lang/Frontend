import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'
import { loginUser } from '../../api/requests'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  // Carregar email salvo quando o componente monta
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const wasRemembered = localStorage.getItem('rememberMe') === 'true'
    
    if (savedEmail && wasRemembered) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha todos os campos')
      setShowErrorModal(true)
      return
    }

    setIsLoading(true)
    
    try {
      await loginUser(email, password)
      
      // Gerenciar "Lembrar de mim"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberMe')
      }
      
      // Login bem-sucedido, redirecionar para a página principal
      navigate('/')
    } catch (error) {
      // Tratar erro de autenticação
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
      setErrorMessage(errorMsg)
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    setErrorMessage('')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Bem-vindo de volta!</h1>
            <p>Faça login em sua conta</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Lembrar de mim
              </label>
              <Link to="#" className="forgot-password">Esqueceu a senha?</Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="signup-link">
              <p>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
            </div>
            
            <div className="back-to-home">
              <Link to="/" className="back-button">
                ← Voltar para Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      <ErrorAuthModal 
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />
    </div>
  )
}