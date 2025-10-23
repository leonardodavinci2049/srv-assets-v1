# ENDPOINT 03 - Listar Arquivos

## POST /file/v1/list-files

Retorna uma lista paginada de arquivos com filtros opcionais.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/list-files`
- **Content-Type**: application/json
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

Os parâmetros de filtro são enviados no body da requisição em formato JSON.

**Body Parameters (opcionais):**

- `entityType` (string): Filtrar por tipo de entidade
- `entityId` (string): Filtrar por ID da entidade (aceita qualquer string válida)
- `fileType` (string): Filtrar por tipo de arquivo (IMAGE, DOCUMENT, SPREADSHEET)
- `status` (string): Filtrar por status (ACTIVE, PROCESSING, ARCHIVED, DELETED). Default: ACTIVE
- `page` (number): Número da página. Default: 1
- `limit` (number): Quantidade de itens por página. Default: 20

### Exemplo de Requisição

```bash
# Listar todos os arquivos (primeira página)
curl -X POST "http://localhost:5573/api/file/v1/list-files" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'

# Listar apenas imagens de um produto específico (UUID)
curl -X POST "http://localhost:5573/api/file/v1/list-files" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "550e8400-e29b-41d4-a716-446655440000",
    "fileType": "IMAGE"
  }'

# Listar apenas imagens de um produto específico (string simples)
curl -X POST "http://localhost:5573/api/file/v1/list-files" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "produto-abc-123",
    "fileType": "IMAGE"
  }'

# Listar imagens de uma categoria
curl -X POST "http://localhost:5573/api/file/v1/list-files" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "CATEGORY",
    "entityId": "cat-smartphones"
  }'

# Listar arquivos com paginação
curl -X POST "http://localhost:5573/api/file/v1/list-files" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 2,
    "limit": 10
  }'
```

### Exemplo de Resposta

```json
{
  "data": [
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
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```
