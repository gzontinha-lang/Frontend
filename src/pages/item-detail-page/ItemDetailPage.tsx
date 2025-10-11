import './ItemDetailPage.css'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getItem, isAuthenticated, isAdmin, deleteItem, updateItem } from '../../api/requests'
import { Item, UpdateItemRequest } from '../../types/api'
import Header from '../../components/Header/Header'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import Loading from '../../components/Loading/Loading'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal'
import EditItemModal from '../../components/EditItemModal/EditItemModal'
import { ImageModal } from '../../components/ImageModal'

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [editFormData, setEditFormData] = useState<UpdateItemRequest>({
    name: '',
    price: 0,
    quantity: 0,
    size: '',
    color: '',
    description: '',
    category: '',
    brand: '',
    imageUrl: ''
  })

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setError('ID do item não fornecido')
        setShowErrorModal(true)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const itemData = await getItem(parseInt(id))
        setItem(itemData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar item'
        setError(errorMessage)
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    // Check authentication and admin status
    const checkAuthStatus = async () => {
      const isAuth = isAuthenticated()
      setUserIsAuthenticated(isAuth)
      
      if (isAuth) {
        try {
          const adminStatus = await isAdmin()
          setUserIsAdmin(adminStatus)
        } catch (error) {
          console.error('Error checking admin status:', error)
          setUserIsAdmin(false)
        }
      } else {
        setUserIsAdmin(false)
      }
    }

    loadItem()
    checkAuthStatus()
  }, [id])

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    setError('')
  }

  const handleLogout = () => {
    setUserIsAuthenticated(false)
    setUserIsAdmin(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!item) return
    
    setIsDeleting(true)
    setShowDeleteConfirm(false)
    
    try {
      await deleteItem(item.id)
      // Sucesso - redirecionar para MainPage
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar item'
      setError(errorMessage)
      setShowErrorModal(true)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleEditClick = () => {
    if (item) {
      setEditFormData({
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        description: item.description,
        category: item.category,
        brand: item.brand,
        imageUrl: item.imageUrl || ''
      })
      setShowEditModal(true)
    }
  }

  const handleEditCancel = () => {
    setShowEditModal(false)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleEditImageUpload = (imageUrl: string) => {
    setEditFormData(prev => ({
      ...prev,
      imageUrl
    }))
  }

  const handleImageClick = () => {
    if (item?.imageUrl) {
      setShowImageModal(true)
    }
  }

  const handleImageModalClose = () => {
    setShowImageModal(false)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return
    
    setIsEditing(true)
    
    try {
      // Validação básica
      if (!editFormData.name || !editFormData.description || !editFormData.category || !editFormData.brand || !editFormData.size || !editFormData.color) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }

      if (editFormData.price <= 0) {
        throw new Error('O preço deve ser maior que zero')
      }

      if (editFormData.quantity < 0) {
        throw new Error('A quantidade não pode ser negativa')
      }

      const updatedItem = await updateItem(item.id, editFormData)
      setItem(updatedItem)
      setShowEditModal(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar item'
      setError(errorMessage)
      setShowErrorModal(true)
    } finally {
      setIsEditing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="item-detail-page">
        <Header 
          authButton={
            <LogoutButton 
              isAuthenticated={userIsAuthenticated}
              onLogout={handleLogout}
            />
          }
          isAdmin={userIsAdmin}
        />
        <div className="loading-container">
          <Loading isVisible={true} />
          <p>Carregando detalhes do item...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="item-detail-page">
        <Header 
          authButton={
            <LogoutButton 
              isAuthenticated={userIsAuthenticated}
              onLogout={handleLogout}
            />
          }
          isAdmin={userIsAdmin}
        />
        <div className="error-container">
          <h2>Item não encontrado</h2>
          <Link to="/" className="back-link">← Voltar para a página principal</Link>
        </div>
        <ErrorAuthModal 
          isOpen={showErrorModal}
          onClose={handleCloseErrorModal}
          message={error || "Erro ao carregar item"}
        />
      </div>
    )
  }

  return (
    <div className="item-detail-page">
      <Header 
        authButton={
          <LogoutButton 
            isAuthenticated={userIsAuthenticated}
            onLogout={handleLogout}
          />
        }
      />
      
      <main className="item-detail-content">
        <div className="detail-container">
          <div className="detail-header">
            <Link to="/" className="back-link">← Voltar para a página principal</Link>
            {userIsAdmin && <span className="admin-badge">Administrador</span>}
          </div>

          <div className="item-detail-card">
            {item.imageUrl && (
              <div className="detail-image-section">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="detail-item-image clickable"
                  onClick={handleImageClick}
                  title="Clique para ampliar"
                />
              </div>
            )}
            
            <div className="detail-main-info">
              <div className="detail-title-section">
                {userIsAdmin && <span className="detail-item-id">ID: {item.id}</span>}
                <h1 className="detail-item-name">{item.name}</h1>
                <div className="detail-price">R$ {parseFloat(item.price).toFixed(2)}</div>
              </div>

              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <span className="detail-label">Categoria:</span>
                  <span className="detail-value">{item.category}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-label">Marca:</span>
                  <span className="detail-value">{item.brand}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-label">Tamanho:</span>
                  <span className="detail-value">{item.size}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-label">Cor:</span>
                  <span className="detail-value color-display">
                    <span 
                      className="detail-color-dot" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.color}
                  </span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-label">Estoque:</span>
                  <span className="detail-value quantity-value">{item.quantity} unidades</span>
                </div>
                {userIsAdmin && (
                  <div className="detail-info-item">
                    <span className="detail-label">Data de Criação:</span>
                    <span className="detail-value">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-description-section">
              <h3 className="description-title">Descrição Completa</h3>
              <p className="detail-description">{item.description}</p>
            </div>

            {userIsAdmin && (
              <div className="detail-actions">
                <button 
                  className="detail-edit-button"
                  onClick={handleEditClick}
                  disabled={isDeleting || isEditing}
                >
                  ✏️ Editar Item
                </button>
                <Link 
                  to="/upload-image"
                  className="detail-upload-button"
                >
                  📷 Upload Image
                </Link>
                <button 
                  className="detail-delete-button"
                  onClick={handleDeleteClick}
                  disabled={isDeleting || isEditing}
                >
                  {isDeleting ? 'Deletando...' : '🗑️ Deletar Item'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <ErrorAuthModal 
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={error || "Erro ao carregar dados"}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        itemName={item?.name || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <EditItemModal
        isOpen={showEditModal}
        isEditing={isEditing}
        formData={editFormData}
        onSubmit={handleEditSubmit}
        onChange={handleEditChange}
        onCancel={handleEditCancel}
        onImageUpload={handleEditImageUpload}
        itemId={item?.id}
      />

      <ImageModal
        isOpen={showImageModal}
        imageUrl={item?.imageUrl || ''}
        imageAlt={item?.name || ''}
        onClose={handleImageModalClose}
      />
    </div>
  )
}
