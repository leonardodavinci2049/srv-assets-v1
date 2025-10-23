# ENDPOINT 04 - Obter Arquivo Específico

## POST /file/v1/find-file

Retorna informações detalhadas de um arquivo específico pelo seu ID.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/find-file`
- **Content-Type**: application/json
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

O ID do arquivo deve ser fornecido no body da requisição.

**Body Parameters:**

- `id` (string): ID UUID do arquivo (obrigatório)

### Exemplo de Requisição

```bash
curl -X POST "http://localhost:5573/api/file/v1/find-file" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }'
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
