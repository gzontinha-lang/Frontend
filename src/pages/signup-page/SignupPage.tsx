import './SignupPage.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../../api/requests'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    age: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Validação básica
      if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirmation) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }

      if (formData.password !== formData.passwordConfirmation) {
        throw new Error('As senhas não coincidem. Por favor, verifique.')
      }

      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }

      await signupUser(formData.name, formData.email, formData.password, formData.passwordConfirmation)
      
      // Sucesso - redirecionar para login
      alert('Cadastro realizado com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <Link to="/" className="back-link">
            ← Voltar para Home
          </Link>
          <h1 className="signup-title">Cadastre-se</h1>
          <p className="signup-subtitle">Crie sua conta no Dora Modas</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', backgroundColor: '#ffe6e6', border: '1px solid #ff9999', borderRadius: '4px'}}>{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Nome Completo:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirmar Senha:</label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Idade:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Digite sua idade"
              required
              min={13}
              max={120}
            />
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? '⏳ Criando conta...' : '🚀 Criar Conta'}
          </button>

          <div className="login-link">
            <p>Já tem uma conta?</p>
            <Link to="/login" className="login-redirect">
              Faça login aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
