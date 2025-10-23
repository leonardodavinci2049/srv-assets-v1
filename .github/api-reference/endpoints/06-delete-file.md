# ENDPOINT 06 - Excluir Arquivo

## POST /file/v1/delete-file

Remove um arquivo do sistema.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/delete-file`
- **Content-Type**: application/json
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

O ID do arquivo deve ser fornecido no body da requisição.

**Body Parameters:**

- `id` (string): ID UUID do arquivo a ser removido (obrigatório)

### Exemplo de Requisição

```bash
curl -X POST "http://localhost:5573/api/file/v1/delete-file" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Exemplo de Resposta

```json
{
  "success": true,
  "message": "Arquivo removido com sucesso"
}
```
