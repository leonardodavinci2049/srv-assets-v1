# ENDPOINT 07 - Definir Imagem Principal

## POST /file/v1/set-primary-image

Define qual imagem será a principal para uma entidade específica. Remove a flag de principal das outras imagens da mesma entidade.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/set-primary-image`
- **Content-Type**: application/json
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

**Body Parameters:**

- `entityType` (string): Tipo da entidade (obrigatório)
- `entityId` (string): ID da entidade (obrigatório)
- `assetId` (string): ID UUID da imagem a ser definida como principal (obrigatório)
- `displayOrder` (number): Nova ordem de exibição (opcional, padrão: 1)

### Exemplo de Requisição

```bash
# Definir nova imagem principal
curl -X POST "http://localhost:5573/api/file/v1/set-primary-image" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "550e8400-e29b-41d4-a716-446655440000",
    "assetId": "234f5678-f90a-23e4-b567-537725285111",
    "displayOrder": 1
  }'
```

### Exemplo de Resposta

```json
{
  "success": true,
  "message": "Primary image updated successfully"
}
```

### Comportamento

- Apenas uma imagem por entidade pode ser marcada como principal
- A imagem anterior marcada como principal automaticamente perde essa condição
- O campo `displayOrder` pode ser omitido (padrão: 1)
- A imagem deve existir e pertencer à entidade especificada
