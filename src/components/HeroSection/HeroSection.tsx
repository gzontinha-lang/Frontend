import './HeroSection.css'
import LoginButton from '../LoginButton/LoginButton'

interface HeroSectionProps {
  onNavigate?: (page: string) => void
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-header">
        <LoginButton />
      </div>
      <div className="hero-content">
        <div className="brand-logo">
          <h1>Dora Modas</h1>
          <span className="brand-tagline">Gerenciamento de Estoque</span>
        </div>
        <p>Sistema completo para controle de inventário da sua loja</p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">📦</span>
            <span className="stat-label">Produtos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🏷️</span>
            <span className="stat-label">Categorias</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">📊</span>
            <span className="stat-label">Relatórios</span>
          </div>
        </div>
      </div>
    </section>
  )
}