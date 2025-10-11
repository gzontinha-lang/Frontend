import './ItemCard.css'
import { Item } from '../../types/api'
import { Link } from 'react-router-dom'

interface ItemCardProps {
  item: Item
  showBuyButton?: boolean
  isAdmin?: boolean
}

export default function ItemCard({ item, showBuyButton = false, isAdmin = false }: ItemCardProps) {
  return (
    <Link to={`/item/${item.id}`} className="item-card-link">
      <div className="item-card">
        <div className="item-image-container">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="item-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="item-image-placeholder">
              <span className="placeholder-icon">📷</span>
              <span className="placeholder-text">Sem imagem</span>
            </div>
          )}
        </div>
        
        <div className="card-header">
          {isAdmin && <span className="item-id">ID: {item.id}</span>}
          <span className="item-price">R$ {parseFloat(item.price).toFixed(2)}</span>
        </div>
        
        <h3 className="item-name">{item.name}</h3>
      
      <div className="item-details">
        <div className="detail-row">
          <span className="label">Categoria:</span>
          <span className="value">{item.category}</span>
        </div>
        <div className="detail-row">
          <span className="label">Marca:</span>
          <span className="value">{item.brand}</span>
        </div>
        <div className="detail-row">
          <span className="label">Tamanho:</span>
          <span className="value">{item.size}</span>
        </div>
        <div className="detail-row">
          <span className="label">Cor:</span>
          <span className="value color-display">
            <span 
              className="color-dot" 
              style={{ backgroundColor: item.color }}
            ></span>
            {item.color}
          </span>
        </div>
      </div>

      {isAdmin && <p className="item-description">{item.description}</p>}

      <div className="card-footer">
        <span className="quantity">Estoque: {item.quantity}</span>
        {isAdmin && (
          <span className="date">
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      </div>
    </Link>
  )
}
