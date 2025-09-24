import './SearchBar.css'

interface SearchBarProps {
  searchById: string
  searchByName: string
  searchByCategory: string
  categories: string[]
  onSearchByIdChange: (value: string) => void
  onSearchByNameChange: (value: string) => void
  onSearchByCategoryChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export default function SearchBar({
  searchById,
  searchByName,
  searchByCategory,
  categories,
  onSearchByIdChange,
  onSearchByNameChange,
  onSearchByCategoryChange,
  onSearch,
  onReset
}: SearchBarProps) {
  return (
    <nav className="search-navbar">
      <div className="search-container">
        <div className="search-group">
          <label htmlFor="search-id">Buscar por ID:</label>
          <input
            id="search-id"
            type="number"
            placeholder="Digite o ID..."
            value={searchById}
            onChange={(e) => onSearchByIdChange(e.target.value)}
          />
        </div>
        
        <div className="search-group">
          <label htmlFor="search-name">Buscar por Nome:</label>
          <input
            id="search-name"
            type="text"
            placeholder="Digite o nome..."
            value={searchByName}
            onChange={(e) => onSearchByNameChange(e.target.value)}
          />
        </div>

        <div className="search-group">
          <label htmlFor="search-category">Buscar por Categoria:</label>
          <select
            id="search-category"
            value={searchByCategory}
            onChange={(e) => onSearchByCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="search-buttons">
          <button onClick={onSearch} className="search-btn">
            🔍 Buscar
          </button>
          <button onClick={onReset} className="reset-btn">
            🔄 Limpar
          </button>
        </div>
      </div>
    </nav>
  )
}
