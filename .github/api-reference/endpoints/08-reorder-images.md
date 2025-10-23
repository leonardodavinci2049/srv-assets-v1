# ENDPOINT 08 - Reordenar Imagens

## POST /file/v1/reorder-images

Reordena todas as imagens de uma entidade definindo a sequência de exibição na galeria.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/reorder-images`
- **Content-Type**: application/json
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

**Body Parameters:**

- `entityType` (string): Tipo da entidade (obrigatório)
- `entityId` (string): ID da entidade (obrigatório)
- `assetIds` (string[]): Array ordenado dos IDs das imagens na nova sequência (obrigatório)

### Exemplo de Requisição

```bash
# Reordenar galeria de produto
curl -X POST "http://localhost:5573/api/file/v1/reorder-images" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "550e8400-e29b-41d4-a716-446655440000",
    "assetIds": [
      "234f5678-f90a-23e4-b567-537725285111",
      "123e4567-e89b-12d3-a456-426614174000",
      "345g6789-g01b-34f5-c678-648836396222",
      "456h7890-h12c-45g6-d789-759947407333"
    ]
  }'
```

### Exemplo de Resposta

```json
{
  "success": true,
  "message": "Images reordered successfully"
}
```

### Comportamento

- A ordem do array `assetIds` define a nova sequência (primeiro = displayOrder: 1)
- Todas as imagens especificadas devem pertencer à entidade informada
- A imagem principal (isPrimary) é mantida, apenas a ordem é alterada
- O sistema valida se todas as imagens existem e pertencem à entidade
- Imagens não incluídas no array `assetIds` não são reordenadas
