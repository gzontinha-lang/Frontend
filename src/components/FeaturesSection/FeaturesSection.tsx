import './FeaturesSection.css'

export default function FeaturesSection() {
  return (
    <section className="features">
      <div className="container">
        <h2>Por que escolher nossa loja?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Frete Grátis</h3>
            <p>Entrega gratuita para compras acima de R$ 100</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Pagamento Seguro</h3>
            <p>Transações 100% seguras e protegidas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Troca Fácil</h3>
            <p>30 dias para trocar ou devolver</p>
          </div>
        </div>
      </div>
    </section>
  )
}
