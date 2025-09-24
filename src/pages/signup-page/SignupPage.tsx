import './SignupPage.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to backend later
    console.log('Signup form data:', formData)
    alert('Cadastro será implementado com o backend!')
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

          <button type="submit" className="signup-button">
            🚀 Criar Conta
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
