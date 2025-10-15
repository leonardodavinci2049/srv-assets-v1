# 🖼️ srv-assets-v1

**API REST para Upload/Download de Arquivos e Servidor de Assets Estáticos**

Sistema completo de gerenciamento de assets (imagens, documentos, planilhas) construído com NestJS, TypeScript, Prisma e MariaDB.

---

## 🎯 Funcionalidades

- ✅ **Upload de múltiplos tipos de arquivo** (imagens, documentos, planilhas)
- ✅ **Processamento automático de imagens** (thumbnail + preview)
- ✅ **Armazenamento organizado** por tipo, data e UUID
- ✅ **API REST completa** com validação e segurança
- ✅ **Servidor de assets estáticos** para download público
- ✅ **Persistência de metadados** com MariaDB + Prisma
- ✅ **Sistema de tags** e relacionamento com entidades externas
- ✅ **Logs de auditoria** completos
- ✅ **Interface web** para upload e visualização

---

## 🚀 Quick Start

### 1. Pré-requisitos

- Node.js 18+
- pnpm
- MariaDB 10.5+ ou MySQL 8+

### 2. Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd srv-assets-v1

# Instalar dependências
pnpm install

# Instalar dependências adicionais
pnpm add multer @types/multer sharp file-type sanitize-filename
```

### 3. Configuração

```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais de banco
# DATABASE_URL="mysql://usuario:senha@localhost:3306/srv_images101?charset=utf8mb4&timezone=UTC"
```

### 4. Banco de Dados

```bash
# Criar database
mysql -u root -p
CREATE DATABASE srv_images101 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Executar migrations
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate
```

### 5. Executar

```bash
# Desenvolvimento
pnpm run dev

# Produção
pnpm run build
pnpm run start:prod
```

Acesse:

- **API:** <http://localhost:3000/api>
- **Interface Web:** <http://localhost:3000/upload>
- **Prisma Studio:** `npx prisma studio`

---

## 📚 Documentação

### Documentos Principais

- **📋 [Resumo Executivo](docs/RESUMO.md)** - Visão geral e decisões técnicas
- **📖 [Plano de Implementação Completo](docs/implementacao-definida.md)** - Documento técnico detalhado (60+ páginas)
- **🛠️ [Guia de Implementação](docs/IMPLEMENTATION_GUIDE.md)** - Passo a passo prático
- **📄 [Análise Original](docs/analise-e-definicoes-projeto.md)** - Análise e opções avaliadas
- **✅ [Opções Selecionadas](docs/selected-options.md)** - Decisões tomadas

### Schema do Banco

- **📐 [Prisma Schema](prisma/schema.prisma)** - Estrutura completa do banco de dados

---

## 🏗️ Arquitetura

### Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | NestJS 11.x |
| **Linguagem** | TypeScript 5.7.3 |
| **Runtime** | Node.js + Express |
| **Banco de Dados** | MariaDB + Prisma ORM |
| **Upload** | Multer |
| **Processamento de Imagens** | Sharp |
| **Validação** | class-validator + file-type |
| **Rate Limiting** | @nestjs/throttler |

### Estrutura de Diretórios

```
srv-assets-v1/
├── src/
│   ├── app.main/          # Módulo principal
│   ├── core/              # Configurações e guards
│   ├── file/              # Módulo de arquivos (principal)
│   ├── image/             # Processamento de imagens
│   ├── storage/           # Gestão de storage
│   └── prisma/            # Prisma service
├── prisma/
│   └── schema.prisma      # Schema do banco
├── upload/                # Arquivos enviados
│   ├── images/
│   ├── documents/
│   └── spreadsheets/
├── pageroot/              # Interface web estática
└── docs/                  # Documentação completa
```

---

## 📡 API Endpoints

### Autenticados (requer `X-API-Key`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/file/upload` | Upload de arquivo |
| GET | `/api/file/list` | Listar assets com filtros |
| GET | `/api/file/:id` | Buscar asset específico |
| DELETE | `/api/file/:id` | Deletar asset (soft delete) |

### Públicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/uploads/**` | Download direto de arquivos |

### Exemplo de Upload

```bash
curl -X POST http://localhost:3000/api/file/upload \
  -H "X-API-Key: sua-chave-aqui" \
  -F "file=@produto.jpg" \
  -F "entityType=PRODUCT" \
  -F "entityId=550e8400-e29b-41d4-a716-446655440000" \
  -F "tags[]=principal" \
  -F "tags[]=destaque"
```

**Response:**

```json
{
  "id": "uuid-do-asset",
  "originalName": "produto.jpg",
  "fileType": "IMAGE",
  "urls": {
    "original": "http://localhost:3000/uploads/images/2025/10/15/{uuid}/original.jpg",
    "preview": "http://localhost:3000/uploads/images/2025/10/15/{uuid}/preview.jpg",
    "thumbnail": "http://localhost:3000/uploads/images/2025/10/15/{uuid}/thumbnail.jpg"
  }
}
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

1. **assets** - Metadados dos arquivos
2. **asset_versions** - Versões (original, preview, thumbnail)
3. **asset_tags** - Tags para organização
4. **asset_logs** - Logs de auditoria
5. **system_config** - Configurações do sistema

### Relacionamento Externo

Cada asset possui:

- `entityType`: Tipo da entidade (PRODUCT, PROFILE, ORDER, etc)
- `entityId`: UUID do cadastro em outro banco de dados

Isso permite relacionar assets com qualquer entidade externa sem acoplamento.

---

## 🔐 Segurança

- ✅ Validação de tipo MIME
- ✅ Verificação de magic numbers (assinatura do arquivo)
- ✅ Sanitização de nomes de arquivo
- ✅ Rate limiting configurável
- ✅ API Key para endpoints administrativos
- ✅ Proteção contra path traversal
- ✅ Logs de auditoria completos

---

## 📊 Configurações

### Tipos de Arquivo Permitidos

- **Imagens:** JPG, PNG, GIF, WebP (máx. 2MB)
- **Documentos:** PDF, DOC, DOCX, TXT (máx. 5MB)
- **Planilhas:** XLS, XLSX, CSV (máx. 5MB)

### Processamento de Imagens

- **Original:** Arquivo preservado como enviado
- **Preview:** 800x600 pixels, compressão 80%
- **Thumbnail:** 200x200 pixels, compressão 80%

### Rate Limiting

- Upload: 10 arquivos/hora por IP
- Download: 100 requisições/hora por IP
- API Global: 500 requisições/hora

---

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

---

## 📦 Scripts Disponíveis

```bash
pnpm run dev          # Modo desenvolvimento (watch)
pnpm run build        # Build para produção
pnpm run start:prod   # Executar produção
pnpm run lint         # Verificar código
pnpm run format       # Formatar código
```

### Scripts Prisma

```bash
npx prisma migrate dev      # Criar migration
npx prisma migrate deploy   # Aplicar migrations (produção)
npx prisma generate         # Gerar Prisma Client
npx prisma studio           # Interface visual do banco
```

---

## 🔧 Variáveis de Ambiente

Principais variáveis (veja `.env.example` para lista completa):

```env
# Aplicação
APP_PORT=3000
NODE_ENV=development

# Segurança
API_KEY=sua-chave-secreta

# Banco de Dados
DATABASE_URL="mysql://root:password@localhost:3306/srv_images101?charset=utf8mb4&timezone=UTC"

# Upload
UPLOAD_MAX_FILE_SIZE_IMAGE=2097152        # 2MB
UPLOAD_MAX_FILE_SIZE_DOCUMENT=5242880     # 5MB
UPLOAD_PATH=./upload

# Imagens
IMAGE_GENERATE_THUMBNAIL=true
IMAGE_THUMBNAIL_WIDTH=200
IMAGE_PREVIEW_WIDTH=800
```

---

## 🚀 Deploy

### Docker (Futuro)

```bash
# Build
docker build -t srv-assets-v1 .

# Run
docker-compose up -d
```

### Manual

1. Configurar servidor com Node.js 18+
2. Instalar MariaDB
3. Clonar repositório
4. Configurar `.env`
5. Executar migrations: `npx prisma migrate deploy`
6. Build: `pnpm run build`
7. Iniciar: `pnpm run start:prod`

---

## 📈 Roadmap

### Fase 1 - MVP ✅ (Atual)

- Upload de arquivos
- Processamento de imagens
- API REST completa
- Banco de dados

### Fase 2 - Melhorias (Futuro)

- [ ] Background jobs (Bull/BullMQ)
- [ ] Migração para S3/MinIO
- [ ] CDN integration
- [ ] Swagger documentation
- [ ] Health checks
- [ ] Métricas e monitoring

### Fase 3 - Escala (Futuro)

- [ ] Múltiplos workers
- [ ] Cache Redis
- [ ] Queue system
- [ ] Backup automático
- [ ] Docker + Kubernetes

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 License

Este projeto está sob a licença MIT.

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação completa](docs/)
2. Verifique o [guia de implementação](docs/IMPLEMENTATION_GUIDE.md)
3. Abra uma issue no repositório

---

**Desenvolvido com NestJS** 🐈

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
