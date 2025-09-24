import './EditItemModal.css'
import { UpdateItemRequest } from '../../types/api'

interface EditItemModalProps {
  isOpen: boolean
  isEditing: boolean
  formData: UpdateItemRequest
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onCancel: () => void
}

export default function EditItemModal({ 
  isOpen, 
  isEditing, 
  formData, 
  onSubmit, 
  onChange, 
  onCancel 
}: EditItemModalProps) {
  if (!isOpen) return null

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>✏️ Editar Item</h3>
          <button className="edit-modal-close" onClick={onCancel}>×</button>
        </div>
        
        <form className="edit-modal-form" onSubmit={onSubmit}>
          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-name">Nome do Produto</label>
              <input 
                type="text" 
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                disabled={isEditing}
              />
            </div>
            
            <div className="edit-form-group">
              <label htmlFor="edit-price">Preço</label>
              <input 
                type="number" 
                id="edit-price"
                name="price"
                value={formData.price || ''}
                onChange={onChange}
                step="0.01"
                min="0"
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-category">Categoria</label>
              <select 
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={onChange}
                required
                disabled={isEditing}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Calçados">Calçados</option>
                <option value="Roupas">Roupas</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Casa">Casa</option>
              </select>
            </div>
            
            <div className="edit-form-group">
              <label htmlFor="edit-brand">Marca</label>
              <input 
                type="text" 
                id="edit-brand"
                name="brand"
                value={formData.brand}
                onChange={onChange}
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label htmlFor="edit-size">Tamanho</label>
              <input 
                type="text" 
                id="edit-size"
                name="size"
                value={formData.size}
                onChange={onChange}
                required
                disabled={isEditing}
              />
            </div>
            
            <div className="edit-form-group">
              <label htmlFor="edit-color">Cor</label>
              <input 
                type="text" 
                id="edit-color"
                name="color"
                value={formData.color}
                onChange={onChange}
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-quantity">Estoque</label>
            <input 
              type="number" 
              id="edit-quantity"
              name="quantity"
              value={formData.quantity || ''}
              onChange={onChange}
              min="0"
              required
              disabled={isEditing}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-description">Descrição</label>
            <textarea 
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={4}
              required
              disabled={isEditing}
            ></textarea>
          </div>

          <div className="edit-modal-actions">
            <button 
              type="button" 
              className="edit-cancel-button"
              onClick={onCancel}
              disabled={isEditing}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="edit-save-button"
              disabled={isEditing}
            >
              {isEditing ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
