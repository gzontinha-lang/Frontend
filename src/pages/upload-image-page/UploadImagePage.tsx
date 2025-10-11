import './UploadImagePage.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllItems, isAuthenticated, isAdmin } from '../../api/requests'
import { Item } from '../../types/api'
import { ImageUpload } from '../../components/ImageUpload'
import Header from '../../components/Header/Header'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import Loading from '../../components/Loading/Loading'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'

export default function UploadImagePage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Verificar autenticação
        const isAuth = isAuthenticated()
        setUserIsAuthenticated(isAuth)
        
        if (!isAuth) {
          setError('Você precisa estar logado para acessar esta página')
          setShowErrorModal(true)
          return
        }

        // Verificar se é admin
        const adminStatus = await isAdmin()
        setUserIsAdmin(adminStatus)
        
        if (!adminStatus) {
          setError('Apenas administradores podem fazer upload de imagens')
          setShowErrorModal(true)
          return
        }

        // Carregar itens
        const itemsData = await getAllItems()
        setItems(itemsData)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados'
        setError(errorMessage)
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    setUserIsAuthenticated(false)
    setUserIsAdmin(false)
  }

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    setError('')
  }

  const handleImageUpload = (imageUrl: string) => {
    // Atualizar o item selecionado com a nova URL da imagem
    if (selectedItem) {
      const updatedItem = { ...selectedItem, imageUrl }
      setSelectedItem(updatedItem)
      
      setItems(prev => prev.map(item => {
        if (item.id === selectedItem.id) {
          return { ...item, imageUrl }
        }
        return item
      }))
    }
  }

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item)
  }

  if (isLoading) {
    return (
      <div className="upload-image-page">
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
          <p>Carregando dados...</p>
        </div>
      </div>
    )
  }

  if (!userIsAuthenticated || !userIsAdmin) {
    return (
      <div className="upload-image-page">
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
          <h2>Acesso Negado</h2>
          <p>Esta página é restrita a administradores.</p>
          <Link to="/" className="back-link">← Voltar para a página principal</Link>
        </div>
        <ErrorAuthModal 
          isOpen={showErrorModal}
          onClose={handleCloseErrorModal}
          message={error || "Erro de acesso"}
        />
      </div>
    )
  }

  return (
    <div className="upload-image-page">
      <Header 
        authButton={
          <LogoutButton 
            isAuthenticated={userIsAuthenticated}
            onLogout={handleLogout}
          />
        }
        isAdmin={userIsAdmin}
      />
      
      <main className="upload-image-content">
        <div className="container">
          <div className="page-header">
            <Link to="/" className="back-to-main-link">
              ← Voltar para Página Principal
            </Link>
            <h1>📷 Upload de Imagens</h1>
            <p>Selecione um item e faça upload da sua imagem</p>
          </div>

          <div className="upload-container">
            <div className="items-selection">
              <h3>Selecione um Item</h3>
              <div className="items-grid">
                {items.map(item => (
                  <div 
                    key={item.id}
                    className={`item-option ${selectedItem?.id === item.id ? 'selected' : ''}`}
                    onClick={() => handleItemSelect(item)}
                  >
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <p className="item-brand">{item.brand}</p>
                      {item.imageUrl && (
                        <div className="current-image">
                          <img src={item.imageUrl} alt={item.name} />
                          <span>Imagem atual</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedItem && (
              <div className="upload-section">
                <h3>Upload de Imagem para: {selectedItem.name}</h3>
                <div className="upload-area">
                  <ImageUpload 
                    onImageUpload={handleImageUpload}
                    currentImageUrl={selectedItem.imageUrl}
                    itemId={selectedItem.id}
                  />
                </div>
                <div className="item-details">
                  <p><strong>Categoria:</strong> {selectedItem.category}</p>
                  <p><strong>Marca:</strong> {selectedItem.brand}</p>
                  <p><strong>Tamanho:</strong> {selectedItem.size}</p>
                  <p><strong>Cor:</strong> {selectedItem.color}</p>
                </div>
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
    </div>
  )
}
