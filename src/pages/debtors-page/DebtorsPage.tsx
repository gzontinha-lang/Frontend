import './DebtorsPage.css'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../../api/requests'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import Loading from '../../components/Loading/Loading'

interface Debtor {
  id: string
  name: string
  amount: number
  description: string
  date: string
  createdAt: string
}

const STORAGE_KEY = 'debtors-list'

export default function DebtorsPage() {
  const navigate = useNavigate()
  const [debtors, setDebtors] = useState<Debtor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  
  // Form states
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Load debtors from localStorage and check auth
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
          setError('Apenas administradores podem acessar esta página')
          setShowErrorModal(true)
          return
        }

        // Carregar devedores do localStorage
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setDebtors(JSON.parse(stored))
        }
        
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

  // Save debtors to localStorage whenever it changes
  useEffect(() => {
    if (userIsAdmin && debtors.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(debtors))
    }
  }, [debtors, userIsAdmin])

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    if (!userIsAuthenticated || !userIsAdmin) {
      navigate('/')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.amount.trim()) {
      setError('Por favor, preencha pelo menos o nome e o valor')
      setShowErrorModal(true)
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('O valor deve ser um número maior que zero')
      setShowErrorModal(true)
      return
    }

    if (editingId) {
      // Editar devedor existente
      setDebtors(prev => prev.map(debtor => 
        debtor.id === editingId
          ? {
              ...debtor,
              name: formData.name.trim(),
              amount: amount,
              description: formData.description.trim(),
              date: formData.date
            }
          : debtor
      ))
    } else {
      // Adicionar novo devedor
      const newDebtor: Debtor = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        amount: amount,
        description: formData.description.trim(),
        date: formData.date,
        createdAt: new Date().toISOString()
      }
      setDebtors(prev => [...prev, newDebtor])
    }

    // Reset form
    setFormData({
      name: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (debtor: Debtor) => {
    setFormData({
      name: debtor.name,
      amount: debtor.amount.toString(),
      description: debtor.description,
      date: debtor.date
    })
    setEditingId(debtor.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setDebtors(prev => prev.filter(debtor => debtor.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
    setEditingId(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const totalDebt = debtors.reduce((sum, debtor) => sum + debtor.amount, 0)

  if (isLoading) {
    return (
      <div className="debtors-page">
        <Loading isVisible={true} />
      </div>
    )
  }

  if (!userIsAuthenticated || !userIsAdmin) {
    return (
      <div className="debtors-page">
        <ErrorAuthModal
          isOpen={showErrorModal}
          onClose={handleCloseErrorModal}
          message={error || 'Acesso negado'}
        />
      </div>
    )
  }

  return (
    <div className="debtors-page">
      <div className="container">
        <div className="page-header-section">
          <Link to="/" className="back-to-main-link">
            ← Voltar para Página Principal
          </Link>
          <h1>📝 Controle de Devedores</h1>
          <p>Gerencie as pessoas que estão devendo</p>
        </div>

        <div className="debtors-summary">
          <div className="summary-card">
            <span className="summary-label">Total de Devedores:</span>
            <span className="summary-value">{debtors.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Valor Total:</span>
            <span className="summary-value total-amount">{formatCurrency(totalDebt)}</span>
          </div>
        </div>

        <div className="debtors-actions">
          {!showForm && (
            <button 
              className="btn-add-debtor"
              onClick={() => setShowForm(true)}
            >
              ➕ Adicionar Novo Devedor
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-container">
            <h2>{editingId ? '✏️ Editar Devedor' : '➕ Novo Devedor'}</h2>
            <form className="debtor-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nome *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome da pessoa"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Valor (R$) *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Data</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição / Observações</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Observações sobre a dívida..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="debtors-list">
          {debtors.length === 0 ? (
            <div className="empty-state">
              <p>📋 Nenhum devedor cadastrado ainda.</p>
              <p>Clique em "Adicionar Novo Devedor" para começar.</p>
            </div>
          ) : (
            <div className="debtors-grid">
              {debtors.map(debtor => (
                <div key={debtor.id} className="debtor-card">
                  <div className="debtor-header">
                    <h3>{debtor.name}</h3>
                    <div className="debtor-amount">{formatCurrency(debtor.amount)}</div>
                  </div>
                  
                  {debtor.description && (
                    <div className="debtor-description">
                      <p>{debtor.description}</p>
                    </div>
                  )}
                  
                  <div className="debtor-footer">
                    <div className="debtor-date">
                      <span>📅 {formatDate(debtor.date)}</span>
                    </div>
                    <div className="debtor-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(debtor)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(debtor.id)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ErrorAuthModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={error}
      />
    </div>
  )
}

