import './MainPage.css'
import { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import SearchBar from '../../components/SearchBar/SearchBar'
import ItemCard from '../../components/ItemCard/ItemCard'
import Footer from '../../components/Footer/Footer'
import { getAllItems, isAuthenticated, isAdmin } from '../../api/requests'
import { Item } from '../../types/api'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import Loading from '../../components/Loading/Loading'
import Pagination from '../../components/Pagination/Pagination'

export default function MainPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [searchById, setSearchById] = useState('')
  const [searchByName, setSearchByName] = useState('')
  const [searchByCategory, setSearchByCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8) // 8 itens por página
  const [paginatedItems, setPaginatedItems] = useState<Item[]>([])

  // Load items from API and check authentication on component mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        const itemsData = await getAllItems()
        setItems(itemsData)
        setFilteredItems(itemsData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar itens'
        setError(errorMessage)
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    // Check authentication status
    setUserIsAuthenticated(isAuthenticated())

    // Check admin status if authenticated
    const checkAdminStatus = async () => {
      if (isAuthenticated()) {
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

    loadItems()
    checkAdminStatus()
  }, [])

  // Listen for changes in authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuth = isAuthenticated()
      setUserIsAuthenticated(isAuth)
      
      // Check admin status if authenticated
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

    // Check auth status when component mounts and on focus
    checkAuthStatus()
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus)
    window.addEventListener('focus', checkAuthStatus)

    return () => {
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('focus', checkAuthStatus)
    }
  }, [])

  // Get unique categories for the dropdown
  const categories = [...new Set(items.map(item => item.category))].sort()

  // Filter items based on search criteria
  const handleSearch = () => {
    let filtered = items

    if (searchById) {
      filtered = filtered.filter(item => item.id.toString().includes(searchById))
    }

    if (searchByName) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchByName.toLowerCase())
      )
    }

    if (searchByCategory) {
      filtered = filtered.filter(item => item.category === searchByCategory)
    }

    setFilteredItems(filtered)
  }

  // Reset filters
  const handleReset = () => {
    setSearchById('')
    setSearchByName('')
    setSearchByCategory('')
    setFilteredItems(items)
  }

  // Close error modal
  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    setError('')
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggingOut(true)
  }

  // Callback quando o loading de logout termina
  const handleLogoutComplete = () => {
    setUserIsAuthenticated(false)
    setUserIsAdmin(false)
    setIsLoggingOut(false)
  }

  // Update pagination when filteredItems or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const itemsForCurrentPage = filteredItems.slice(startIndex, endIndex)
    setPaginatedItems(itemsForCurrentPage)
  }, [filteredItems, currentPage, itemsPerPage])

  // Scroll reveal animation for cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observe all item cards
    const cards = document.querySelectorAll('.item-card')
    cards.forEach((card) => {
      card.classList.add('scroll-reveal')
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [paginatedItems])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchById, searchByName, searchByCategory])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate pagination values
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const totalItems = filteredItems.length

  return (
    <div className="main-page">
      <Header 
        authButton={
          <LogoutButton 
            isAuthenticated={userIsAuthenticated}
            onLogout={handleLogout}
          />
        }
        isAdmin={userIsAdmin}
      />
      
      <SearchBar
        searchById={searchById}
        searchByName={searchByName}
        searchByCategory={searchByCategory}
        categories={categories}
        onSearchByIdChange={setSearchById}
        onSearchByNameChange={setSearchByName}
        onSearchByCategoryChange={setSearchByCategory}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <main className="items-section">
        {isLoading ? (
          <div className="loading-state">
            <p>Carregando itens...</p>
          </div>
        ) : isLoggingOut ? (
          <Loading 
            isVisible={isLoggingOut}
            duration={500}
            onComplete={handleLogoutComplete}
          />
        ) : (
          <>
            <div className="items-grid">
              {paginatedItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  showBuyButton={false}
                  isAdmin={userIsAdmin}
                />
              ))}
            </div>

            {/* Mostrar mensagem se não houver itens */}
            {filteredItems.length === 0 && !isLoading && (
              <div className="no-items-message">
                <h3>Nenhum item encontrado</h3>
                <p>Tente ajustar os filtros de busca ou verificar novamente mais tarde.</p>
              </div>
            )}

            {/* Componente de Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />

          </>
        )}
      </main>

      <Footer />

      <ErrorAuthModal 
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={error || "Erro ao carregar dados"}
      />
    </div>
  )
}