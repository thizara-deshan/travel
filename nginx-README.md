# BitTravel Nginx Reverse Proxy Setup

This setup includes an Nginx reverse proxy that serves your BitTravel application via `https://thizara.dev`.

## 🏗️ Architecture

```
Internet → Nginx (Port 80/443) → Frontend (Port 3000) / Backend API (Port 5000)
```

- **Nginx**: Acts as a reverse proxy and SSL terminator
- **Frontend**: Next.js application running on port 3000
- **Backend**: Node.js API running on port 5000
- **Database**: PostgreSQL on port 5432

## 🚀 Quick Start

### Production Deployment

1. **Set up SSL certificates** (see SSL section below)
2. **Update DNS**: Point `thizara.dev` to your server's IP
3. **Deploy**: Run the production stack
   ```bash
   docker-compose up -d
   ```

### Development Setup

For development with hot reloading:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

This provides:

- Direct access to frontend: `http://localhost:3000`
- Direct access to backend API: `http://localhost:5000`
- Nginx proxy access: `https://thizara.dev` (requires hosts file entry)

## 🔐 SSL Certificate Setup

### Option 1: Let's Encrypt (Production - Recommended)

```bash
# Install certbot
sudo apt-get update && sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d thizara.dev -d www.thizara.dev

# Copy certificates
sudo cp /etc/letsencrypt/live/thizara.dev/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/thizara.dev/privkey.pem ./ssl/
sudo chown $USER:$USER ./ssl/*.pem
```

### Option 2: Self-signed (Development/Testing)

The repository includes a self-signed certificate for immediate testing. To regenerate:

**Windows:**

```cmd
cd ssl
generate-cert.bat
```

**Linux/Mac:**

```bash
cd ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout privkey.pem \
    -out fullchain.pem \
    -subj "/C=US/ST=Development/L=Local/O=BitTravel/CN=thizara.dev"
```

**Using Docker:**

```bash
cd ssl
docker run --rm -v "${PWD}:/certs" alpine/openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /certs/privkey.pem -out /certs/fullchain.pem -subj "/C=US/ST=Development/L=Local/O=BitTravel/CN=thizara.dev"
```

## 🌐 Domain Configuration

### For Production

1. Update your domain's DNS A record to point `thizara.dev` to your server's IP
2. Ensure both `thizara.dev` and `www.thizara.dev` point to your server

### For Local Testing

Add to your hosts file:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac:** `/etc/hosts`

```
127.0.0.1 thizara.dev
127.0.0.1 www.thizara.dev
```

## 📋 Features

### Security

- ✅ HTTPS redirect (HTTP → HTTPS)
- ✅ HSTS headers
- ✅ Security headers (XSS protection, content type sniffing protection)
- ✅ Rate limiting on API endpoints
- ✅ Special rate limiting on auth endpoints

### Performance

- ✅ Gzip compression
- ✅ HTTP/2 support
- ✅ Optimized SSL configuration
- ✅ Proxy buffering optimization for Next.js

### Monitoring

- ✅ Health check endpoint: `/nginx-health`
- ✅ Nginx access logs
- ✅ Container health checks

## 🔧 Configuration

### Nginx Configuration

The main configuration is in `nginx.conf`. Key sections:

- **Rate Limiting**: Protects against abuse
- **SSL/TLS**: Modern, secure configuration
- **Proxy Settings**: Optimized for Next.js and Node.js
- **Security Headers**: Enhanced security posture

### Environment Variables

Updated in docker-compose.yml:

- `CORS_ORIGIN`: Changed to `https://thizara.dev`
- `NEXT_PUBLIC_API_URL`: Backend URL for frontend

## 🚨 Troubleshooting

### Common Issues

1. **Certificate errors**:

   - Ensure SSL files exist and have correct permissions
   - Check certificate validity: `openssl x509 -in ssl/fullchain.pem -text -noout`

2. **Domain not resolving**:

   - Check DNS configuration
   - Verify hosts file for local testing

3. **502 Bad Gateway**:

   - Ensure backend and frontend containers are running
   - Check container logs: `docker-compose logs nginx`

4. **Rate limiting issues**:
   - Adjust rate limits in `nginx.conf` if needed
   - Check Nginx logs for rate limit hits

### Useful Commands

```bash
# View logs
docker-compose logs nginx
docker-compose logs frontend
docker-compose logs backend

# Restart services
docker-compose restart nginx

# Test Nginx configuration
docker-compose exec nginx nginx -t

# Reload Nginx configuration
docker-compose exec nginx nginx -s reload

# Check certificate
openssl x509 -in ssl/fullchain.pem -text -noout

# Test HTTPS connection
curl -k https://thizara.dev/nginx-health
```

## 🔄 Deployment Workflow

### Development

```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Access via:
# - Direct frontend: http://localhost:3000
# - Direct backend: http://localhost:5000/api
# - Through Nginx: https://thizara.dev
```

### Production

```bash
# Build and start production environment
docker-compose up -d --build

# Access via:
# - https://thizara.dev (main site)
# - http://thizara.dev (redirects to HTTPS)
```

### Updates

```bash
# Update with new code
git pull
docker-compose down
docker-compose up -d --build

# Update SSL certificates (Let's Encrypt)
sudo certbot renew
sudo cp /etc/letsencrypt/live/thizara.dev/*.pem ./ssl/
docker-compose restart nginx
```

## 📈 Monitoring & Maintenance

- Monitor certificate expiration dates
- Regularly update Docker images
- Review Nginx access logs for security issues
- Monitor rate limiting effectiveness
- Keep backup of SSL certificates

## 🔗 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/) - Test your SSL configuration
