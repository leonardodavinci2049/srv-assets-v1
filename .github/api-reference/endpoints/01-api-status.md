# ENDPOINT 01 - Status da API

## GET /file

Retorna informações gerais sobre o status da API.

### Informações do Endpoint

- **Método**: GET
- **URL**: `/api/file`
- **Autenticação**: ❌ Não requerida
- **Content-Type**: application/json

### Request Body

Nenhum body é necessário para esta requisição.

### Exemplo de Requisição

```bash
curl -X GET http://localhost:5573/api/file
```

### Exemplo de Resposta

```json
{
  "name": "SRV_ASSETS",
  "status": "online",
  "version": "1.0.0",
  "documentation": "/",
  "timestamp": "2025-10-23T10:30:00.000Z",
  "endpoints": {
    "base": "/api",
    "upload": "/api/file/v1/upload-file",
    "list": "/api/file/v1/list-files",
    "getOne": "/api/file/v1/find-file",
    "delete": "/api/file/v1/delete-file",
    "gallery": "/api/file/v1/entity-gallery",
    "setPrimary": "/api/file/v1/set-primary-image",
    "reorder": "/api/file/v1/reorder-images",
    "note": "All endpoints require x-api-key header"
  }
}
```
