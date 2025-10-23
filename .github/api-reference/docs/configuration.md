# Configuração - API Reference

## Variáveis de Ambiente Principais

Para usar a API, você deve configurar as seguintes variáveis de ambiente no arquivo `.env`:

### Configuração da API

```env
# API Configuration
EXTERNAL_API_ASSETS_URL=http://localhost:5573/api
APP_PORT=5573
APP_API_SECRET=your-secret-api-key-here
NODE_ENV=development
```

### Configuração de Banco de Dados

```env
# Database
DATABASE_URL="mysql://user:password@host:port/database?charset=utf8mb4&timezone=UTC"
```

### Configuração de Upload

```env
# Upload Configuration
UPLOAD_MAX_FILE_SIZE_GLOBAL=10485760    # 10MB
UPLOAD_MAX_FILE_SIZE_IMAGE=2097152      # 2MB
UPLOAD_MAX_FILE_SIZE_DOCUMENT=5242880   # 5MB
UPLOAD_PATH=./upload
UPLOAD_SERVE_PATH=/uploads

# Image Processing
IMAGE_GENERATE_THUMBNAIL=true
IMAGE_THUMBNAIL_WIDTH=200
IMAGE_THUMBNAIL_HEIGHT=200
IMAGE_PREVIEW_WIDTH=800
IMAGE_PREVIEW_HEIGHT=600
```

### Rate Limiting

```env
# Rate Limiting
THROTTLE_UPLOAD_LIMIT=10               # uploads per hour
THROTTLE_API_LIMIT=500                 # requests per hour
THROTTLE_DOWNLOAD_LIMIT=100            # downloads per hour
```

---

## Configuração por Ambiente

### Desenvolvimento

```env
EXTERNAL_API_ASSETS_URL=http://localhost:5573/api
APP_PORT=5573
NODE_ENV=development
APP_API_SECRET=dev-secret-key

DATABASE_URL="mysql://root:password@localhost:3306/srv_assets?charset=utf8mb4&timezone=UTC"

UPLOAD_PATH=./upload
```

### Staging/Teste

```env
EXTERNAL_API_ASSETS_URL=https://staging-api.seudominio.com/api
APP_PORT=443
NODE_ENV=staging
APP_API_SECRET=staging-secret-key-secure

DATABASE_URL="mysql://user:secure-password@db.staging.internal:3306/srv_assets?charset=utf8mb4&timezone=UTC"

UPLOAD_PATH=/mnt/uploads
THROTTLE_UPLOAD_LIMIT=20
THROTTLE_API_LIMIT=1000
```

### Produção

```env
EXTERNAL_API_ASSETS_URL=https://api.seudominio.com/api
APP_PORT=443
NODE_ENV=production
APP_API_SECRET=production-secret-key-very-secure

DATABASE_URL="mysql://user:secure-password@db.prod.internal:3306/srv_assets?charset=utf8mb4&timezone=UTC"

UPLOAD_PATH=/var/data/uploads
UPLOAD_MAX_FILE_SIZE_GLOBAL=10485760

THROTTLE_UPLOAD_LIMIT=5
THROTTLE_API_LIMIT=200
THROTTLE_DOWNLOAD_LIMIT=50
```

---

## Configuração Passo a Passo

### 1. Copiar arquivo de ambiente

```bash
cp .env.example .env
```

### 2. Configurar URL base

A URL base deve incluir `/api` no final:

```env
# Desenvolvimento
EXTERNAL_API_ASSETS_URL=http://localhost:5573/api

# Produção
EXTERNAL_API_ASSETS_URL=https://api.seudominio.com/api
```

### 3. Configurar API Key

Gere uma chave segura para produção:

```env
# Desenvolvimento (pode ser simples)
APP_API_SECRET=dev-secret-key

# Produção (deve ser uma string aleatória longa)
APP_API_SECRET=xK9mL2pQ8vN5wR3tJ7fH1uG6sB4dE0cA
```

### 4. Configurar banco de dados

Substitua as credenciais padrão:

```env
DATABASE_URL="mysql://seu_usuario:sua_senha@seu_host:3306/srv_assets?charset=utf8mb4&timezone=UTC"
```

**Componentes da URL:**

- `seu_usuario`: Usuário do banco de dados
- `sua_senha`: Senha do banco de dados
- `seu_host`: Host/IP do servidor (localhost, 192.168.1.1, db.prod.com, etc.)
- `3306`: Porta padrão do MySQL (ajuste se necessário)
- `srv_assets`: Nome do banco de dados
- `charset=utf8mb4&timezone=UTC`: Configurações recomendadas

### 5. Ajustar limite de porta (opcional)

```env
# Porta padrão é 3000, ajuste se necessário
APP_PORT=5573
```

### 6. Testar configuração

```bash
# Instalar dependências
pnpm install

# Rodar migrations
npx prisma migrate dev

# Iniciar aplicação
pnpm run dev

# Acessar
curl http://localhost:5573/api/file
```

---

## Variáveis Avançadas

### Image Processing

Personalize os tamanhos das imagens geradas:

```env
# Thumbnail (miniaturas para galerias)
IMAGE_THUMBNAIL_WIDTH=200
IMAGE_THUMBNAIL_HEIGHT=200

# Preview (preview para visualizador)
IMAGE_PREVIEW_WIDTH=800
IMAGE_PREVIEW_HEIGHT=600

# Medium (tamanho intermediário, opcional)
IMAGE_MEDIUM_WIDTH=400
IMAGE_MEDIUM_HEIGHT=300

# Qualidade de compressão (0-100)
IMAGE_COMPRESSION_QUALITY=80
```

### Rate Limiting (Proteção contra abuso)

Limite requisições por endereço IP:

```env
# Upload: máximo de uploads por hora
THROTTLE_UPLOAD_LIMIT=10

# API: máximo de requisições por hora
THROTTLE_API_LIMIT=500

# Download: máximo de downloads por hora
THROTTLE_DOWNLOAD_LIMIT=100
```

### Diretórios

Configure onde os arquivos são armazenados:

```env
# Diretório de upload (relativo ou absoluto)
UPLOAD_PATH=./upload

# Caminho public para servir os arquivos
UPLOAD_SERVE_PATH=/uploads

# Diretório temporário
UPLOAD_TEMP_PATH=./upload/temp
```

---

## Validação de Arquivo

Tipos MIME permitidos por padrão:

### Imagens

```
image/jpeg
image/png
image/gif
image/webp
```

### Documentos

```
application/pdf
application/msword
application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### Planilhas

```
application/vnd.ms-excel
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
text/csv
```

---

## Exemplo .env completo

```env
# ============================================
# API Configuration
# ============================================
EXTERNAL_API_ASSETS_URL=http://localhost:5573/api
APP_PORT=5573
APP_API_SECRET=dev-secret-key-change-in-production
NODE_ENV=development

# ============================================
# Database Configuration
# ============================================
DATABASE_URL="mysql://root:password@localhost:3306/srv_assets?charset=utf8mb4&timezone=UTC"

# ============================================
# File Upload Configuration
# ============================================
UPLOAD_MAX_FILE_SIZE_GLOBAL=10485760
UPLOAD_MAX_FILE_SIZE_IMAGE=2097152
UPLOAD_MAX_FILE_SIZE_DOCUMENT=5242880
UPLOAD_PATH=./upload
UPLOAD_SERVE_PATH=/uploads
UPLOAD_TEMP_PATH=./upload/temp

# ============================================
# Image Processing Configuration
# ============================================
IMAGE_GENERATE_THUMBNAIL=true
IMAGE_THUMBNAIL_WIDTH=200
IMAGE_THUMBNAIL_HEIGHT=200
IMAGE_PREVIEW_WIDTH=800
IMAGE_PREVIEW_HEIGHT=600
IMAGE_MEDIUM_WIDTH=400
IMAGE_MEDIUM_HEIGHT=300
IMAGE_COMPRESSION_QUALITY=80

# ============================================
# Rate Limiting Configuration
# ============================================
THROTTLE_UPLOAD_LIMIT=10
THROTTLE_API_LIMIT=500
THROTTLE_DOWNLOAD_LIMIT=100

# ============================================
# Logging Configuration (opcional)
# ============================================
LOG_LEVEL=debug
LOG_FORMAT=json
```

---

## Troubleshooting

### Erro: "DATABASE_URL is invalid"

**Causa**: String de conexão incorreta

**Solução**:

- Verifique usuario:senha
- Verifique o hostname e porta
- Verifique o nome do banco de dados

### Erro: "Port already in use"

**Causa**: A porta configurada já está em uso

**Solução**:

```bash
# Mude a porta no .env
APP_PORT=5574

# Ou mate o processo anterior
lsof -i :5573
kill -9 <PID>
```

### Erro: "API Key is required"

**Causa**: Header `x-api-key` não foi incluído

**Solução**:

```bash
curl -H "x-api-key: YOUR_API_SECRET_KEY" http://localhost:5573/api/file
```

### Erro: "Upload directory not found"

**Causa**: Diretório de upload não existe

**Solução**:

```bash
mkdir -p ./upload/images
mkdir -p ./upload/documents
mkdir -p ./upload/spreadsheets
mkdir -p ./upload/temp
```

---

## Segurança

### Boas Práticas

1. **Nunca commit `.env`** no repositório - use `.env.example`
2. **Use chaves fortes** para `APP_API_SECRET` em produção
3. **Limite rate limiting** mais restritivamente em produção
4. **Use variáveis de ambiente** para dados sensíveis
5. **Configure CORS** apropriadamente
6. **Ativar HTTPS** em produção
7. **Validar tipos de arquivo** no frontend e backend
8. **Implementar backup** dos arquivos de upload

### Exemplo `.env.example`

```env
EXTERNAL_API_ASSETS_URL=http://localhost:5573/api
APP_PORT=5573
APP_API_SECRET=change_me_in_production
NODE_ENV=development

DATABASE_URL="mysql://user:password@localhost:3306/database?charset=utf8mb4&timezone=UTC"

UPLOAD_PATH=./upload
UPLOAD_SERVE_PATH=/uploads

IMAGE_THUMBNAIL_WIDTH=200
IMAGE_PREVIEW_WIDTH=800

THROTTLE_UPLOAD_LIMIT=10
THROTTLE_API_LIMIT=500
```
