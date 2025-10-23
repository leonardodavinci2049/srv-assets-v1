# ENDPOINT 05 - Galeria de Imagens de Entidade

## POST /file/v1/entity-gallery

Retorna uma galeria de imagens de uma entidade específica (máximo 7 imagens), ideal para páginas de detalhe de produto em e-commerce.

### Informações do Endpoint

- **Método**: POST
- **URL**: `/api/file/v1/entity-gallery`
- **Content-Type**: application/json
- **Autenticação**: ✅ Requerida (x-api-key)

### Request Body

Os parâmetros de entidade devem ser fornecidos no body da requisição.

**Body Parameters:**

- `entityType` (string): Tipo da entidade (obrigatório). Valores possíveis:
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
- `entityId` (string): ID da entidade (obrigatório - aceita qualquer string válida)

### Características Especiais

- **Limite de imagens**: Máximo 7 imagens por requisição (otimizado para e-commerce)
- **Ordenação**: Por imagem principal (isPrimary), ordem de exibição (displayOrder) e data de upload
- **Filtros automáticos**: Apenas imagens ativas e do tipo IMAGE
- **Múltiplas versões**: Inclui original, preview, medium e thumbnail
- **Contador total**: Informa quantas imagens existem no total

### Exemplo de Requisição

```bash
# Galeria de produto para e-commerce
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Galeria de perfil de usuário (string simples)
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PROFILE",
    "entityId": "user-12345"
  }'

# Galeria de produto (UUID)
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Galeria de categoria
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "CATEGORY",
    "entityId": "categoria-eletronicos"
  }'

# Galeria de marca
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "BRAND",
    "entityId": "marca-samsung"
  }'
```

### Exemplo de Resposta

```json
{
  "entityType": "PRODUCT",
  "entityId": "550e8400-e29b-41d4-a716-446655440000",
  "totalImages": 12,
  "images": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "originalName": "product-main-image.jpg",
      "uploadedAt": "2025-10-23T10:30:00.000Z",
      "tags": ["featured", "main", "hero"],
      "isPrimary": true,
      "displayOrder": 1,
      "urls": {
        "original": "http://localhost:5573/uploads/images/2025/10/23/123e4567-e89b-12d3-a456-426614174000/original.jpg",
        "preview": "http://localhost:5573/uploads/images/2025/10/23/123e4567-e89b-12d3-a456-426614174000/preview.jpg",
        "medium": "http://localhost:5573/uploads/images/2025/10/23/123e4567-e89b-12d3-a456-426614174000/medium.jpg",
        "thumbnail": "http://localhost:5573/uploads/images/2025/10/23/123e4567-e89b-12d3-a456-426614174000/thumbnail.jpg"
      }
    },
    {
      "id": "234f5678-f90a-23e4-b567-537725285111",
      "originalName": "product-detail-01.jpg",
      "uploadedAt": "2025-10-23T10:35:00.000Z",
      "tags": ["detail", "secondary"],
      "isPrimary": false,
      "displayOrder": 2,
      "urls": {
        "original": "http://localhost:5573/uploads/images/2025/10/23/234f5678-f90a-23e4-b567-537725285111/original.jpg",
        "preview": "http://localhost:5573/uploads/images/2025/10/23/234f5678-f90a-23e4-b567-537725285111/preview.jpg",
        "medium": "http://localhost:5573/uploads/images/2025/10/23/234f5678-f90a-23e4-b567-537725285111/medium.jpg",
        "thumbnail": "http://localhost:5573/uploads/images/2025/10/23/234f5678-f90a-23e4-b567-537725285111/thumbnail.jpg"
      }
    }
  ]
}
```

### Resposta quando não há imagens

```json
{
  "entityType": "PRODUCT",
  "entityId": "nonexistent-product",
  "totalImages": 0,
  "images": []
}
```

### Casos de Uso

**PRODUCT - Produtos:**

- Imagem com `isPrimary: true`: Imagem principal do produto (sempre primeira no array)
- Demais imagens: Ordenadas por `displayOrder`, depois por data de upload
- `urls.thumbnail`: Para miniaturas na galeria
- `urls.preview`: Para visualização ampliada
- `urls.original`: Para zoom máximo

**PROFILE - Perfil de Usuário:**

- Fotos do perfil e galeria pessoal
- Avatar principal e imagens secundárias

**LOGO - Logos da Empresa:**

- Logos oficiais, variações de marca
- Diferentes versões (horizontal, vertical, monocromático)

**BANNER - Banners Promocionais:**

- Banners para campanhas, promoções
- Imagens para carrosséis e destaques

**CATEGORY - Categorias:**

- Imagens representativas de categorias
- Ícones e banners de seções

**BRAND - Marcas:**

- Logos e imagens de marcas parceiras
- Matérias de fornecedores e fabricantes

**ORDER/INVOICE - Documentos:**

- Comprovantes, notas fiscais
- Documentos relacionados a pedidos
