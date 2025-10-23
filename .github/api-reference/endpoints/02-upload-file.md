# ENDPOINT 02 - Upload de Arquivo

## POST /file/v1/upload-file

Realiza o upload de um arquivo para o servidor.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/upload-file`
- **Content-Type**: multipart/form-data
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

O body deve ser enviado como `multipart/form-data` contendo:

**Campos obrigatórios:**

- `file` (File): O arquivo a ser enviado
- `entityType` (string): Tipo da entidade. Valores possíveis:
  - `PRODUCT` - Imagens de produtos
  - `PROFILE` - Fotos de perfil
  - `ORDER` - Documentos de pedidos
  - `INVOICE` - Notas fiscais
  - `BANNER` - Banners promocionais
  - `LOGO` - Logos da empresa
  - `CATEGORY` - Imagens de categorias
  - `BRAND` - Imagens de marcas
  - `GALLERY` - Galeria geral
  - `OTHER` - Outros tipos
- `entityId` (string): ID da entidade associada (aceita qualquer string válida)

**Campos opcionais:**

- `tags` (string[]): Array de tags para categorização
- `description` (string): Descrição do arquivo
- `altText` (string): Texto alternativo para acessibilidade
- `isPrimary` (boolean): Define se esta é a imagem principal da entidade
- `displayOrder` (number): Ordem de exibição na galeria (1 = primeiro)

**Tipos de arquivos suportados:**

- **Imagens**: JPG, PNG, GIF, WebP
- **Documentos**: PDF, DOC, DOCX
- **Planilhas**: XLS, XLSX, CSV

### Exemplo de Requisição

```bash
# Exemplo com UUID - Imagem principal
curl -X POST http://localhost:5573/api/file/v1/upload-file \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -F "file=@exemplo.jpg" \
  -F "entityType=PRODUCT" \
  -F "entityId=550e8400-e29b-41d4-a716-446655440000" \
  -F "tags=imagem,produto,principal" \
  -F "description=Foto do produto principal" \
  -F "altText=Imagem do produto XYZ" \
  -F "isPrimary=true" \
  -F "displayOrder=1"

# Exemplo com string simples
curl -X POST http://localhost:5573/api/file/v1/upload-file \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -F "file=@logo.png" \
  -F "entityType=LOGO" \
  -F "entityId=empresa-123" \
  -F "tags=logo,marca" \
  -F "description=Logo oficial da empresa" \
  -F "altText=Logo da marca principal"
```

### Exemplo de Resposta

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "entityType": "PRODUCT",
  "entityId": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "exemplo.jpg",
  "fileType": "IMAGE",
  "mimeType": "image/jpeg",
  "fileSize": 245760,
  "status": "ACTIVE",
  "uploadedAt": "2025-10-23T10:30:00.000Z",
  "tags": ["imagem", "produto"],
  "versions": [
    {
      "versionType": "original",
      "fileName": "original.jpg",
      "url": "/uploads/images/2025/10/23/123e4567-e89b-12d3-a456-426614174000/original.jpg",
      "fileSize": 245760,
      "width": 1920,
      "height": 1080
    }
  ],
  "urls": {
    "original": "http://localhost:5573/uploads/images/2025/10/23/123e4567-e89b-12d3-a456-426614174000/original.jpg"
  }
}
```
