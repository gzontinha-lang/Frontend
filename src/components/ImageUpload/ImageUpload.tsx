import './ImageUpload.css'
import { useState, useRef } from 'react'
import { API_BASE_URL, isAdmin } from '../../api/requests'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImageUrl?: string
  itemId?: number
  disabled?: boolean
  className?: string
}

export default function ImageUpload({ 
  onImageUpload, 
  currentImageUrl, 
  itemId,
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Tipos de arquivo permitidos
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSizeInMB = 5

  const validateFile = (file: File): boolean => {
    // Verificar tipo de arquivo
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Use JPG, PNG ou WebP.')
      return false
    }

    // Verificar tamanho do arquivo
    const sizeInMB = file.size / (1024 * 1024)
    if (sizeInMB > maxSizeInMB) {
      setError(`Arquivo muito grande. Tamanho máximo permitido: ${maxSizeInMB}MB`)
      return false
    }

    return true
  }

  const createPreview = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    setError('')
    setSuccess(false)

    try {
      // Verificar se o usuário está autenticado
      const token = localStorage.getItem('access-token')
      if (!token) {
        throw new Error('Token de acesso não encontrado. Faça login novamente.')
      }

      // Verificar se o usuário é admin
      const userIsAdmin = await isAdmin()
      if (!userIsAdmin) {
        throw new Error('Apenas administradores podem fazer upload de imagens.')
      }

      const formData = new FormData()
      formData.append('image', file)
      
      // Incluir itemId apenas se for edição de item existente
      if (itemId) {
        formData.append('itemId', itemId.toString())
      }

      // Criar headers específicos para FormData (sem Content-Type)
      const headers: HeadersInit = {}
      if (token) {
        headers['access-token'] = token
      }

      const response = await fetch(`${API_BASE_URL}/upload-item-image`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao fazer upload da imagem')
      }

      const data = await response.json()
      // Verificar se a resposta contém a URL da imagem
      // O backend retorna imageUrl diretamente na raiz
      let imageUrl = data.imageUrl
      
      // Se não estiver na raiz, tentar em data.item.imageUrl
      if (!imageUrl && data.item && data.item.imageUrl) {
        imageUrl = data.item.imageUrl
      }
      
      if (!imageUrl) {
        throw new Error('URL da imagem não foi retornada pelo servidor')
      }
      
      // Chamar callback com a URL da imagem
      onImageUpload(imageUrl)
      
      // Mostrar sucesso
      setSuccess(true)
      
      // Limpar preview local após upload bem-sucedido
      // Agora que temos a URL do Cloudflare, não precisamos mais do preview base64
      setPreviewUrl(null)
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload da imagem'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar arquivo
    if (!validateFile(file)) {
      return
    }

    // Criar preview imediatamente
    createPreview(file)

    // Fazer upload
    await uploadImage(file)
  }

  const handleButtonClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    
    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (!file) return

    // Validar arquivo
    if (!validateFile(file)) {
      return
    }

    // Criar preview imediatamente
    createPreview(file)

    // Fazer upload
    await uploadImage(file)
  }

  // Priorizar currentImageUrl (URL do Cloudflare) sobre previewUrl (base64)
  const displayImage = currentImageUrl || previewUrl
  

  return (
    <div className={`image-upload ${className}`}>
      <div 
        className={`upload-area ${disabled ? 'disabled' : ''} ${isUploading ? 'uploading' : ''}`}
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled || isUploading}
        />

        {displayImage ? (
          <div className="image-preview">
            <img src={displayImage} alt="Preview" />
            <div className="overlay">
              <div className="overlay-content">
                <span className="upload-icon">📷</span>
                <span className="upload-text">
                  {isUploading ? 'Enviando...' : 'Clique para alterar'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              {isUploading ? 'Enviando imagem...' : 'Clique ou arraste uma imagem aqui'}
            </div>
            <div className="upload-hint">
              Formatos: JPG, PNG, WebP • Máximo: {maxSizeInMB}MB
            </div>
          </div>
        )}

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-spinner"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {success && (
        <div className="upload-success">
          ✅ Imagem enviada com sucesso!
        </div>
      )}
    </div>
  )
}
