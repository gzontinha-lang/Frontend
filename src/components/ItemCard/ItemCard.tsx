import './ItemCard.css'
import { Item } from '../../types/api'
import { Link, useNavigate } from 'react-router-dom'

interface ItemCardProps {
  item: Item
  showBuyButton?: boolean
  isAdmin?: boolean
}

const WHATSAPP_NUMBER = '5511916850647'

export default function ItemCard({ item, showBuyButton = false, isAdmin = false }: ItemCardProps) {
  const navigate = useNavigate()

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const itemUrl = `${window.location.origin}/item/${item.id}`
    const message = encodeURIComponent(`Tenho interesse nesse item\n\n${itemUrl}`)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleCardClick = () => {
    navigate(`/item/${item.id}`)
  }

  return (
    <div className="item-card-wrapper">
      <div className="item-card" onClick={handleCardClick}>
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
        <div className="card-footer-right">
          <button
            className="whatsapp-button"
            onClick={handleWhatsAppClick}
            title="Falar no WhatsApp"
          >
            <span className="whatsapp-icon">💬</span>
            <span className="whatsapp-text">WhatsApp</span>
          </button>
          {isAdmin && (
            <span className="date">
              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      </div>
    </div>
  )
}
