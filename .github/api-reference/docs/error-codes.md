# Códigos de Erro - API Reference

A API utiliza códigos de status HTTP padrão para indicar o resultado das requisições.

## Status Codes

| Código | Status | Descrição |
|--------|--------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 400 | Bad Request | Erro na requisição (parâmetros inválidos, arquivo não suportado, etc.) |
| 401 | Unauthorized | API Key ausente ou inválida |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

---

## Exemplos de Respostas de Erro

### Arquivo não suportado (400)

```json
{
  "statusCode": 400,
  "message": "File type image/svg+xml is not allowed",
  "error": "Bad Request"
}
```

### API Key ausente (401)

```json
{
  "statusCode": 401,
  "message": "API Key is required",
  "error": "Unauthorized"
}
```

### API Key inválida (401)

```json
{
  "statusCode": 401,
  "message": "Invalid API Key",
  "error": "Unauthorized"
}
```

### Tipo de entidade inválido (400)

Tipo de entidade inválido no endpoint Entity Gallery:

```json
{
  "statusCode": 400,
  "message": [
    "entityType must be a valid enum value"
  ],
  "error": "Bad Request"
}
```

### Parâmetros obrigatórios ausentes (400)

Campos obrigatórios não fornecidos:

```json
{
  "statusCode": 400,
  "message": [
    "entityType should not be empty",
    "entityId should not be empty"
  ],
  "error": "Bad Request"
}
```

### Imagem não encontrada (404)

Tentativa de definir uma imagem como principal que não existe:

```json
{
  "statusCode": 404,
  "message": "Image asset 234f5678-f90a-23e4-b567-537725285111 not found for PRODUCT:550e8400-e29b-41d4-a716-446655440000",
  "error": "Not Found"
}
```

### Erro ao reordenar - imagens não pertencem à entidade (400)

Algumas imagens não foram encontradas ou não pertencem à entidade:

```json
{
  "statusCode": 400,
  "message": "Some assets not found or don't belong to PRODUCT:550e8400-e29b-41d4-a716-446655440000",
  "error": "Bad Request"
}
```

### Arquivo não encontrado (404)

Tentativa de acessar um arquivo que não existe:

```json
{
  "statusCode": 404,
  "message": "File with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

### Erro interno do servidor (500)

Erro inesperado no servidor:

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Boas Práticas

1. **Sempre valide a API Key** antes de fazer requisições em produção
2. **Verifique os tipos de arquivo** antes de fazer upload (use a validação no frontend)
3. **Trate os erros 401 e 403** pedindo ao usuário para verificar suas credenciais
4. **Implemente retry logic** para erros 5xx (com backoff exponencial)
5. **Log detalhado** de todos os erros para debugging
6. **Forneça feedback claro** ao usuário sobre o que deu errado
