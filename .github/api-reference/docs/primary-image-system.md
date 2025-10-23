# Sistema de Imagem Principal - API Reference

O srv-assets-v1 implementa um sistema robusto para gerenciar imagens principais em galerias, especialmente otimizado para e-commerce e produtos.

## Conceitos Principais

### Imagem Principal (isPrimary)

- Apenas **uma imagem por entidade** pode ser marcada como principal
- A imagem principal sempre aparece **primeiro na galeria**
- Ao definir uma nova imagem como principal, a anterior **perde automaticamente** essa condição

### Ordem de Exibição (displayOrder)

- Campo numérico que define a **sequência das imagens** (1, 2, 3...)
- Permite **controle total** da ordem de exibição
- Funciona em conjunto com `isPrimary` para ordenação inteligente

### Comportamento Automático

- **Primeira imagem carregada** → Automaticamente marcada como principal
- **Upload com `isPrimary: true`** → Remove flag das outras imagens
- **Ordenação da galeria** → Primary first, then displayOrder, then uploadedAt

---

## Fluxo de Trabalho Recomendado

### 1. Upload da Imagem Principal

Primeira imagem do produto será automaticamente marcada como principal:

```bash
curl -X POST "http://localhost:5573/api/file/v1/upload-file" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -F "file=@produto-principal.jpg" \
  -F "entityType=PRODUCT" \
  -F "entityId=produto-123" \
  -F "isPrimary=true" \
  -F "displayOrder=1"
```

### 2. Upload de Imagens Secundárias

Imagens adicionais (sem isPrimary - será false automaticamente):

```bash
curl -X POST "http://localhost:5573/api/file/v1/upload-file" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -F "file=@produto-detalhe.jpg" \
  -F "entityType=PRODUCT" \
  -F "entityId=produto-123" \
  -F "displayOrder=2"
```

### 3. Carregar Galeria Ordenada

Sempre retorna imagens ordenadas (principal primeiro):

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "produto-123"
  }'
```

### 4. Alterar Imagem Principal

Trocar qual imagem é a principal:

```bash
curl -X POST "http://localhost:5573/api/file/v1/set-primary-image" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "produto-123",
    "assetId": "nova-imagem-principal-id"
  }'
```

### 5. Reordenar Galeria

Definir nova ordem de todas as imagens:

```bash
curl -X POST "http://localhost:5573/api/file/v1/reorder-images" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "produto-123",
    "assetIds": [
      "id-novo-principal",
      "id-segundo",
      "id-terceiro",
      "id-quarto"
    ]
  }'
```

---

## Casos de Uso por EntityType

### PRODUCT (Produtos)

- **Imagem principal**: Vista frontal do produto
- **Secundárias**: Detalhes, ângulos, variações
- **Máximo recomendado**: 7 imagens
- **URLs disponíveis**: original, preview, medium, thumbnail

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PRODUCT",
    "entityId": "sku-12345"
  }'
```

### PROFILE (Perfil de Usuário)

- **Imagem principal**: Avatar/foto de perfil
- **Secundárias**: Fotos adicionais da galeria pessoal
- **Uso**: Redes sociais, perfis de usuário

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "PROFILE",
    "entityId": "user-550e8400"
  }'
```

### LOGO (Marca)

- **Imagem principal**: Logo oficial
- **Secundárias**: Variações (horizontal, vertical, monocromático)
- **Uso**: Assets de marca, guidelines

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "LOGO",
    "entityId": "marca-oficial"
  }'
```

### BANNER (Banners Promocionais)

- **Imagem principal**: Banner destacado
- **Secundárias**: Variações de campanha
- **Uso**: Homepages, carrosséis, promoções

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "BANNER",
    "entityId": "black-friday-2025"
  }'
```

### CATEGORY (Categorias)

- **Imagem principal**: Imagem representativa da categoria
- **Secundárias**: Variações, ícones, banners
- **Uso**: Navegação, listagens

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "CATEGORY",
    "entityId": "eletronicos"
  }'
```

### BRAND (Marcas)

- **Imagem principal**: Logo da marca
- **Secundárias**: Imagens adicionais, banners
- **Uso**: Parceiros, fornecedores, fabricantes

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "BRAND",
    "entityId": "samsung"
  }'
```

### ORDER/INVOICE (Documentos)

- **Imagem principal**: Comprovante principal ou primeira página
- **Secundárias**: Outras páginas, documentos relacionados
- **Uso**: Comprovantes, notas fiscais, pedidos

**Exemplo:**

```bash
curl -X POST "http://localhost:5573/api/file/v1/entity-gallery" \
  -H "x-api-key: YOUR_API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "ORDER",
    "entityId": "pedido-2025-001"
  }'
```

---

## Integração Frontend

### Exemplo React/Next.js

```jsx
import { useEffect, useState } from 'react';

const ProductGallery = ({ productId }) => {
  const [gallery, setGallery] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Carregar galeria
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/file/v1/entity-gallery', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entityType: 'PRODUCT',
            entityId: productId
          })
        });
        
        const data = await response.json();
        setGallery(data);
        
        // Seleciona a imagem principal por padrão
        if (data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, [productId]);
  
  if (loading) return <div className="loading">Carregando imagens...</div>;
  if (!gallery || gallery.images.length === 0) return <div>Sem imagens disponíveis</div>;
  
  return (
    <div className="product-gallery">
      {/* Imagem Principal */}
      <div className="main-image-container">
        <img 
          src={selectedImage?.urls.medium} 
          alt={selectedImage?.originalName}
          className="main-image"
        />
      </div>
      
      {/* Thumbnails ordenadas */}
      <div className="thumbnails">
        {gallery.images.map(image => (
          <img 
            key={image.id}
            src={image.urls.thumbnail}
            alt={image.originalName}
            className={`thumb ${image.id === selectedImage?.id ? 'active' : ''}`}
            onClick={() => setSelectedImage(image)}
            title={image.originalName}
          />
        ))}
      </div>
      
      {/* Contador de imagens */}
      <div className="info">
        Mostrando {gallery.images.length} de {gallery.totalImages} imagens
      </div>
    </div>
  );
};

export default ProductGallery;
```

### Exemplo Vue.js

```vue
<template>
  <div class="product-gallery">
    <!-- Imagem Principal -->
    <div class="main-image-container">
      <img 
        v-if="selectedImage"
        :src="selectedImage.urls.medium" 
        :alt="selectedImage.originalName"
        class="main-image"
      />
    </div>
    
    <!-- Thumbnails -->
    <div class="thumbnails">
      <img 
        v-for="image in gallery.images" 
        :key="image.id"
        :src="image.urls.thumbnail"
        :alt="image.originalName"
        :class="['thumb', { active: image.id === selectedImage?.id }]"
        @click="selectedImage = image"
      />
    </div>
    
    <!-- Informações -->
    <p class="info">
      Mostrando {{ gallery.images.length }} de {{ gallery.totalImages }} imagens
    </p>
  </div>
</template>

<script>
export default {
  props: {
    productId: String,
    apiKey: String
  },
  data() {
    return {
      gallery: { images: [], totalImages: 0 },
      selectedImage: null,
      loading: true
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/file/v1/entity-gallery', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entityType: 'PRODUCT',
          entityId: this.productId
        })
      });
      
      this.gallery = await response.json();
      if (this.gallery.images.length > 0) {
        this.selectedImage = this.gallery.images[0];
      }
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f5f5;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.thumb {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border-radius: 4px;
  object-fit: cover;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumb:hover,
.thumb.active {
  opacity: 1;
}
</style>
```

---

## Boas Práticas

1. **Sempre defina uma imagem principal** ao fazer upload de múltiplas imagens
2. **Use a galeria com limite de 7 imagens** para otimizar performance
3. **Ordene as imagens logicamente** (maior zoom primeiro, depois detalhes)
4. **Cache as URLs** das imagens no frontend para evitar requisições desnecessárias
5. **Implemente lazy loading** para galeriasmuy grandes
6. **Teste em mobile** para garantir boa experiência de navegação
7. **Forneça feedback visual** ao trocar de imagem (zoom, transição suave)
