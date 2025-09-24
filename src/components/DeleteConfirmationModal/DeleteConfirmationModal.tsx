import './DeleteConfirmationModal.css'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  itemName: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  itemName, 
  isDeleting, 
  onConfirm, 
  onCancel 
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>⚠️ Confirmar Deleção</h3>
        </div>
        <div className="delete-modal-body">
          <p>Tem certeza que deseja deletar o item <strong>"{itemName}"</strong>?</p>
          <p className="delete-warning">Esta ação não pode ser desfeita!</p>
        </div>
        <div className="delete-modal-actions">
          <button 
            className="delete-cancel-button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button 
            className="delete-confirm-button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deletando...' : 'Sim, Deletar'}
          </button>
        </div>
      </div>
    </div>
  )
}
