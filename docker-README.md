# BitTravel Docker Setup

This repository contains the Docker configuration for the BitTravel application, including both frontend and backend services with a PostgreSQL database.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0 or higher

## Quick Start

1. **Clone the repository and navigate to the project root:**

   ```bash
   cd bitTravel
   ```

2. **Create environment files:**

   ```bash
   # Copy and modify environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Update environment variables:**

   - Edit `backend/.env` and change the `JWT_SECRET` to a secure random string
   - Modify other environment variables as needed

4. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

   Or run in detached mode:

   ```bash
   docker-compose up --build -d
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Services

### Frontend (Next.js)

- **Container name:** `bittravel_frontend`
- **Port:** 3000
- **Build context:** `./frontend`

### Backend (Node.js/Express)

- **Container name:** `bittravel_backend`
- **Port:** 5000
- **Build context:** `./backend`

### Database (PostgreSQL)

- **Container name:** `bittravel_postgres`
- **Port:** 5432
- **Credentials:**
  - User: `bittravel_user`
  - Password: `bittravel_password`
  - Database: `bittravel_db`

### Prisma Migration

- **Container name:** `bittravel_prisma_migrate`
- **Purpose:** Runs database migrations on startup

## Docker Commands

### Development

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: This will delete database data)
docker-compose down -v
```

### Production

```bash
# Build and start in production mode
docker-compose -f docker-compose.yml up --build -d

# Scale services (if needed)
docker-compose up --scale backend=2 -d
```

### Maintenance

```bash
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Clean everything (CAUTION: This removes all unused Docker resources)
docker system prune -a
```

## Environment Variables

### Backend (.env)

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Backend server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (CHANGE THIS IN PRODUCTION)
- `CORS_ORIGIN`: Allowed frontend origin

### Frontend (.env)

- `NODE_ENV`: Environment mode (development/production)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Volumes

- `postgres_data`: Persistent storage for PostgreSQL data
- `backend_receipts`: Persistent storage for uploaded receipts

## Networks

- `bittravel_network`: Internal Docker network for service communication

## Health Checks

All services include health checks:

- **PostgreSQL:** Checks database availability
- **Backend:** Checks `/health` endpoint
- **Frontend:** Built-in Next.js health monitoring

## Troubleshooting

### Common Issues

1. **Port conflicts:**

   ```bash
   # Check if ports are in use
   netstat -an | findstr :3000
   netstat -an | findstr :5000
   netstat -an | findstr :5432
   ```

2. **Database connection issues:**

   ```bash
   # Check if postgres is running
   docker-compose ps postgres

   # View postgres logs
   docker-compose logs postgres
   ```

3. **Permission issues (Linux/Mac):**

   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Clear Docker cache:**
   ```bash
   docker-compose down
   docker system prune -a
   docker-compose build --no-cache
   ```

### Database Management

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U bittravel_user -d bittravel_db

# Run Prisma commands
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma studio
```

## Security Notes

- Change the default JWT_SECRET in production
- Use strong passwords for database credentials
- Consider using Docker secrets for sensitive data in production
- Regularly update base images for security patches

## Development vs Production

For development, you might want to:

- Mount source code as volumes for hot reloading
- Expose additional ports for debugging
- Use development-specific environment variables

For production:

- Use specific image tags instead of `latest`
- Implement proper logging and monitoring
- Use orchestration tools like Kubernetes for scaling
- Set up proper backup strategies for the database
