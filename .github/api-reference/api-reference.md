# API Reference - srv-assets-v1

Esta documentação descreve os endpoints disponíveis na API de gerenciamento de arquivos do srv-assets-v1.

## 📋 Índice de Endpoints

| # | Endpoint | Método | Autenticação | Descrição |
|---|----------|--------|--------------|-----------|
| 01 | [/file](endpoints/01-api-status.md) | GET | ❌ | Status da API |
| 02 | [/file/v1/upload-file](endpoints/02-upload-file.md) | POST | ✅ | Upload de arquivo |
| 03 | [/file/v1/list-files](endpoints/03-list-files.md) | POST | ✅ | Listar arquivos com filtros |
| 04 | [/file/v1/find-file](endpoints/04-find-file.md) | POST | ✅ | Obter arquivo específico |
| 05 | [/file/v1/entity-gallery](endpoints/05-entity-gallery.md) | POST | ✅ | Galeria de imagens da entidade |
| 06 | [/file/v1/delete-file](endpoints/06-delete-file.md) | POST | ✅ | Excluir arquivo |
| 07 | [/file/v1/set-primary-image](endpoints/07-set-primary-image.md) | POST | ✅ | Definir imagem principal |
| 08 | [/file/v1/reorder-images](endpoints/08-reorder-images.md) | POST | ✅ | Reordenar imagens |

---

## Base URL

A URL base da API é definida pela variável de ambiente `EXTERNAL_API_ASSETS_URL` no arquivo `.env`:

**Exemplo de desenvolvimento:**

```url
http://localhost:5573/api (valor vem da variável de ambiente)
```

**Configuração:**

- A URL e porta são configuradas através da variável `EXTERNAL_API_ASSETS_URL` no `.env`
- Em produção, ajuste esta variável conforme seu domínio e configuração
- Exemplo: `EXTERNAL_API_ASSETS_URL=https://api.meudominio.com/api`

---

## Autenticação

⚠️ **IMPORTANTE**: Todos os endpoints protegidos requerem autenticação via API Key.

### Header de Autenticação

Para acessar endpoints protegidos, você deve incluir o header:

```
x-api-key: YOUR_API_SECRET_KEY
```

---

## ⚡ Notas Importantes

1. **URL Base**: Configurada via `EXTERNAL_API_ASSETS_URL` no `.env` - ajuste conforme seu ambiente
2. **Autenticação**: Todos os endpoints (exceto o status) requerem o header `x-api-key`
3. **Versionamento**: Todos os endpoints operacionais usam o prefixo `v1/`
4. **Métodos HTTP**: Todos os endpoints operacionais usam POST para consistência
5. **Tipos de Arquivo**: Apenas os tipos MIME permitidos são aceitos (JPG, PNG, GIF, WebP, PDF, DOC, DOCX, XLS, XLSX, CSV)
6. **EntityId vs ID**: `entityId` aceita qualquer string válida (IDs externos), enquanto `id` usa UUID (IDs internos)
7. **Galeria de Entidades**: O endpoint `/entity-gallery` é otimizado para e-commerce com limite de 7 imagens
8. **Imagem Principal**: Apenas uma imagem por entidade pode ser marcada como principal (`isPrimary: true`)

---

## 📌 Seções Adicionais

Para informações detalhadas sobre tratamento de erros, sistema de imagem principal, configuração e casos de uso, consulte os documentos separados:

- **[Códigos de Erro](./docs/error-codes.md)** - Códigos HTTP e mensagens de erro
- **[Sistema de Imagem Principal](./docs/primary-image-system.md)** - Documentação completa do sistema de gerenciamento de imagens
- **[Configuração](./docs/configuration.md)** - Variáveis de ambiente e configuração da API
