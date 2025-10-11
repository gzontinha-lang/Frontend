import './AddItemPage.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { addItem } from '../../api/requests'
import { AddItemRequest } from '../../types/api'

export default function AddItemPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<AddItemRequest>({
    name: '',
    price: 0,
    size: '',
    color: '',
    description: '',
    category: '',
    brand: '',
    quantity: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validação básica
      if (!formData.name || !formData.description || !formData.category || !formData.brand || !formData.size || !formData.color) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }

      if (formData.price <= 0) {
        throw new Error('O preço deve ser maior que zero')
      }

      if (formData.quantity < 0) {
        throw new Error('A quantidade não pode ser negativa')
      }

      await addItem(formData)
      
      // Sucesso - redirecionar para a página principal
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="add-item-page">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-to-main-link">
            ← Voltar para Página Principal
          </Link>
          <h1>Adicionar Novo Item</h1>
          <p>Preencha os dados do produto que deseja adicionar</p>
        </div>

        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          
          <form className="add-item-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome do Produto</label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Tênis Esportivo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o produto..."
                rows={4}
                required
                disabled={isLoading}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Preço</label>
                <input 
                  type="number" 
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoria</label>
                <select 
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Calçados">Calçados</option>
                  <option value="Roupas">Roupas</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Casa">Casa</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Marca</label>
                <input 
                  type="text" 
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ex: Nike, Adidas, etc."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="size">Tamanho</label>
                <input 
                  type="text" 
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="Ex: M, 42, XL, etc."
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Cor</label>
                <input 
                  type="text" 
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Ex: Azul, Vermelho, etc."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Estoque</label>
                <input 
                  type="number" 
                  id="quantity"
                  name="quantity"
                  value={formData.quantity || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}