# 🖼️ srv-assets-v1

**REST API for File Upload/Download and Static Assets Server**

Complete asset management system (images, documents, spreadsheets) built with NestJS, TypeScript, Prisma, and MariaDB.

---

## 🎯 Features

- ✅ **Multiple file type uploads** (images, documents, spreadsheets)
- ✅ **Automatic image processing** (thumbnail + preview)
- ✅ **Organized storage** by type, date, and UUID
- ✅ **Complete REST API** with validation and security
- ✅ **Static assets server** for public downloads
- ✅ **Metadata persistence** with MariaDB + Prisma
- ✅ **Tag system** and external entity relationships
- ✅ **Complete audit logs**
- ✅ **Web interface** for upload and visualization

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- pnpm
- MariaDB 10.5+ or MySQL 8+

### 2. Installation

```bash
# Clone repository
git clone <repo-url>
cd srv-assets-v1

# Install dependencies
pnpm install
```

### 3. Configuration

```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="mysql://user:password@localhost:3306/srv_assets?charset=utf8mb4&timezone=UTC"
```

### 4. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE srv_assets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 5. Run

```bash
# Development
pnpm run dev

# Production
pnpm run build
pnpm run start:prod
```

Access:

- **API:** <http://localhost:3000/api>
- **Web Interface:** <http://localhost:3000/upload>
- **Prisma Studio:** `npx prisma studio`

---

## 📚 Documentation

### Main Documents

- **📋 [Executive Summary](docs/RESUMO.md)** - Overview and technical decisions
- **📖 [Complete Implementation Plan](docs/implementacao-definida.md)** - Detailed technical document (60+ pages)
- **🛠️ [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)** - Step-by-step practical guide
- **📐 [Prisma Schema](prisma/schema.prisma)** - Complete database structure

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | NestJS 11.x |
| **Language** | TypeScript 5.7.3 |
| **Runtime** | Node.js + Express |
| **Database** | MariaDB + Prisma ORM |
| **Upload** | Multer |
| **Image Processing** | Sharp |
| **Validation** | class-validator + file-type |
| **Rate Limiting** | @nestjs/throttler |

### Directory Structure

```
srv-assets-v1/
├── src/
│   ├── app.main/          # Main module
│   ├── core/              # Configuration and guards
│   ├── file/              # File module (main)
│   ├── image/             # Image processing
│   ├── storage/           # Storage management
│   └── prisma/            # Prisma service
├── prisma/
│   └── schema.prisma      # Database schema
├── upload/                # Uploaded files
│   ├── images/
│   ├── documents/
│   └── spreadsheets/
├── pageroot/              # Static web interface
└── docs/                  # Complete documentation
```

---

## 📡 API Endpoints

### Authenticated (requires `X-API-Key`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/file/upload` | File upload |
| GET | `/api/file/list` | List assets with filters |
| GET | `/api/file/:id` | Get specific asset |
| DELETE | `/api/file/:id` | Delete asset (soft delete) |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/uploads/**` | Direct file download |

### Upload Example

```bash
curl -X POST http://localhost:3000/api/file/upload \
  -H "X-API-Key: your-api-key-here" \
  -F "file=@product.jpg" \
  -F "entityType=PRODUCT" \
  -F "entityId=550e8400-e29b-41d4-a716-446655440000" \
  -F "tags[]=featured" \
  -F "tags[]=main"
```

**Response:**

```json
{
  "id": "asset-uuid",
  "originalName": "product.jpg",
  "fileType": "IMAGE",
  "urls": {
    "original": "http://localhost:3000/uploads/images/2025/10/15/{uuid}/original.jpg",
    "preview": "http://localhost:3000/uploads/images/2025/10/15/{uuid}/preview.jpg",
    "thumbnail": "http://localhost:3000/uploads/images/2025/10/15/{uuid}/thumbnail.jpg"
  }
}
```

---

## 🗄️ Database

### Main Tables

1. **assets** - File metadata
2. **asset_versions** - Versions (original, preview, thumbnail)
3. **asset_tags** - Tags for organization
4. **asset_logs** - Audit logs
5. **system_config** - System configuration

### External Relationships

Each asset has:

- `entityType`: Entity type (PRODUCT, PROFILE, ORDER, etc)
- `entityId`: UUID of record in another database

This allows relating assets with any external entity without coupling.

---

## 🔐 Security

- ✅ MIME type validation
- ✅ Magic number verification (file signature)
- ✅ Filename sanitization
- ✅ Configurable rate limiting
- ✅ API Key for administrative endpoints
- ✅ Path traversal protection
- ✅ Complete audit logs

---

## 📊 Configuration

### Allowed File Types

- **Images:** JPG, PNG, GIF, WebP (max. 2MB)
- **Documents:** PDF, DOC, DOCX, TXT (max. 5MB)
- **Spreadsheets:** XLS, XLSX, CSV (max. 5MB)

### Image Processing

- **Original:** File preserved as uploaded
- **Preview:** 800x600 pixels, 80% compression
- **Thumbnail:** 200x200 pixels, 80% compression

### Rate Limiting

- Upload: 10 files/hour per IP
- Download: 100 requests/hour per IP
- Global API: 500 requests/hour

---

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

---

## 📦 Available Scripts

```bash
pnpm run dev          # Development mode (watch)
pnpm run build        # Build for production
pnpm run start:prod   # Run production
pnpm run lint         # Check code
pnpm run format       # Format code
```

### Prisma Scripts

```bash
npx prisma migrate dev      # Create migration
npx prisma migrate deploy   # Apply migrations (production)
npx prisma generate         # Generate Prisma Client
npx prisma studio           # Visual database interface
```

---

## 🔧 Environment Variables

Main variables (see `.env.example` for complete list):

```env
# Application
APP_API_URL=http://localhost:3000
APP_API_SECRET=your-secret-key-here
APP_PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="mysql://user:password@localhost:3306/srv_assets?charset=utf8mb4&timezone=UTC"

# Upload
UPLOAD_MAX_FILE_SIZE_IMAGE=2097152        # 2MB
UPLOAD_MAX_FILE_SIZE_DOCUMENT=5242880     # 5MB
UPLOAD_PATH=./upload

# Images
IMAGE_GENERATE_THUMBNAIL=true
IMAGE_THUMBNAIL_WIDTH=200
IMAGE_PREVIEW_WIDTH=800
```

---

## 🚀 Deployment

### Docker (Future)

```bash
# Build
docker build -t srv-assets-v1 .

# Run
docker-compose up -d
```

### Manual

1. Set up server with Node.js 18+
2. Install MariaDB
3. Clone repository
4. Configure `.env`
5. Run migrations: `npx prisma migrate deploy`
6. Build: `pnpm run build`
7. Start: `pnpm run start:prod`

---

## 📈 Roadmap

### Phase 1 - MVP ✅ (Current)

- File upload
- Image processing
- Complete REST API
- Database

### Phase 2 - Improvements (Future)

- [ ] Background jobs (Bull/BullMQ)
- [ ] Migration to S3/MinIO
- [ ] CDN integration
- [ ] Swagger documentation
- [ ] Health checks
- [ ] Metrics and monitoring

### Phase 3 - Scale (Future)

- [ ] Multiple workers
- [ ] Redis cache
- [ ] Queue system
- [ ] Automatic backup
- [ ] Docker + Kubernetes

---

## 🤝 Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📝 License

This project is under the MIT license.

---

## 🆘 Support

For questions or issues:

1. Check the [complete documentation](docs/)
2. Review the [implementation guide](docs/IMPLEMENTATION_GUIDE.md)
3. Open an issue in the repository

---

**Built with NestJS** 🐈

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
