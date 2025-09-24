import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}: PaginationProps) {
  if (totalPages <= 1) {
    return null // Não mostrar paginação se houver apenas 1 página
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const generatePageNumbers = () => {
    const pages = []
    const delta = 2 // Quantas páginas mostrar de cada lado da página atual

    // Primeira página
    if (currentPage > delta + 1) {
      pages.push(1)
      if (currentPage > delta + 2) {
        pages.push('...')
      }
    }

    // Páginas ao redor da atual
    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages, currentPage + delta)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Última página
    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-text">
          Mostrando {startItem}-{endItem} de {totalItems} itens
        </span>
      </div>

      <div className="pagination-controls">
        {/* Botão Anterior */}
        <button 
          className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <span className="pagination-icon">←</span>
          <span className="pagination-label">Anterior</span>
        </button>

        {/* Números das páginas */}
        <div className="pagination-numbers">
          {generatePageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${
                page === currentPage ? 'active' : ''
              } ${page === '...' ? 'dots' : ''}`}
              onClick={() => handlePageClick(page)}
              disabled={page === '...' || page === currentPage}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Botão Próximo */}
        <button 
          className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          <span className="pagination-label">Próximo</span>
          <span className="pagination-icon">→</span>
        </button>
      </div>

      <div className="pagination-summary">
        <span className="pagination-page-info">
          Página {currentPage} de {totalPages}
        </span>
      </div>
    </div>
  )
}

