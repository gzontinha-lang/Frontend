import './ProductsSection.css'

export default function ProductsSection() {
  return (
    <section className="products-preview">
      <div className="container">
        <h2>Produtos em Destaque</h2>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-image">📱</div>
            <h3>Smartphone XYZ</h3>
            <p className="price">R$ 899,90</p>
            <button className="add-to-cart">Adicionar ao Carrinho</button>
          </div>
          <div className="product-card">
            <div className="product-image">💻</div>
            <h3>Notebook ABC</h3>
            <p className="price">R$ 2.499,90</p>
            <button className="add-to-cart">Adicionar ao Carrinho</button>
          </div>
          <div className="product-card">
            <div className="product-image">🎧</div>
            <h3>Fones de Ouvido</h3>
            <p className="price">R$ 199,90</p>
            <button className="add-to-cart">Adicionar ao Carrinho</button>
          </div>
          <div className="product-card">
            <div className="product-image">⌚</div>
            <h3>Smartwatch</h3>
            <p className="price">R$ 599,90</p>
            <button className="add-to-cart">Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    </section>
  )
}
