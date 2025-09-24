import './NewsletterSection.css'

export default function NewsletterSection() {
  return (
    <section className="newsletter">
      <div className="container">
        <h2>Receba nossas ofertas</h2>
        <p>Cadastre-se e receba promoções exclusivas</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Seu e-mail" />
          <button>Cadastrar</button>
        </div>
      </div>
    </section>
  )
}
