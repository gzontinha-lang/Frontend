import './ImageModal.css'

interface ImageModalProps {
  isOpen: boolean
  imageUrl: string
  imageAlt: string
  onClose: () => void
}

export default function ImageModal({ isOpen, imageUrl, imageAlt, onClose }: ImageModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div 
      className="image-modal-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="image-modal-container">
        <button 
          className="image-modal-close"
          onClick={onClose}
          aria-label="Fechar imagem"
        >
          ×
        </button>
        
        <div className="image-modal-content">
          <img 
            src={imageUrl} 
            alt={imageAlt}
            className="image-modal-image"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="image-modal-caption">
            {imageAlt}
          </div>
        </div>
      </div>
    </div>
  )
}
